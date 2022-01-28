import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import config, { getMetisNetworkConfig } from "utils/config";
import { convertGiftCardTupleToObject } from "utils/conversion";

/**
 * Get address of the wallet from signature.
 */
function getAddressFromSignature(
  tokenId: string,
  owner: string,
  signature: string
): boolean {
  const address = ethers.utils.verifyMessage(
    `Token ID: ${tokenId}\nOwner: ${owner}`,
    signature
  );
  return address === owner;
}

/**
 * Unwrap the gift card using the admin account itself so that the user does not have to pay for
 * the transaction.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(404).send({
      message: "Not found",
    });
  }

  const { net } = req.query;
  if (net !== "mainnet" && net !== "testnet") {
    return res.status(404).send({
      message: "Not found",
    });
  }

  const { tokenId, owner, signature } = req.body ?? {};
  if (!tokenId || !owner || !signature) {
    return res.status(400).send({
      message: "Requires `tokenId`, `owner` and `signature` to be present",
    });
  }

  const { endpoint, privateKey } = getMetisNetworkConfig(net);
  if (!endpoint || !privateKey) {
    return res.status(500).send({
      message: "Internal server error",
    });
  }

  try {
    const isValidRequest = getAddressFromSignature(tokenId, owner, signature);
    if (!isValidRequest) {
      return res.status(400).send({
        message: "Invalid signature",
      });
    }

    const provider = new ethers.providers.JsonRpcProvider(endpoint);

    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(
      config.CONTRACT_ADDRESS,
      config.CONTRACT_ABI,
      signer
    );

    const giftCardTuple = await contract.getGiftCardOfOwnerByAdmin(
      tokenId,
      owner
    );
    const giftCard = convertGiftCardTupleToObject(giftCardTuple);
    if (giftCard.isUnwrapped) {
      return res.status(400).send({
        message: "Gift already unwrapped.",
      });
    }

    const gasPrice = await signer.getGasPrice();
    const gasLimit = await contract.estimateGas.unwrapGiftCardByAdmin(
      tokenId,
      owner,
      // A dummy tx fee just to estimate.
      ethers.BigNumber.from(1e12)
    );

    const txFee = gasLimit.mul(gasPrice);
    // If the gift amount is less than the tx fee, user won't receive anything. And we will be at
    // a loss on our end as tx fee won't be repaid in full.
    if (giftCard.amount.lte(txFee)) {
      // TODO: Log the event and send notification to me.
      return res.status(400).send({
        message: "Transaction fee exceeds the gift amount.",
      });
    }

    // Balance of the admin account.
    const balance = await signer.getBalance();
    // If the tx fee is more than the balance, then cannot unwrap.
    if (balance.lte(txFee)) {
      // TODO: Log the event and send notification to me.
      return res.status(500).send({
        message:
          "Cannot unwrap your gift for free at the moment. You can unwrap using your own wallet.",
      });
    }

    const tx = await contract.unwrapGiftCardByAdmin(tokenId, owner, txFee, {
      gasPrice,
      gasLimit,
    });
    await tx.wait();

    // TODO: Because transactions are not resolved using the async-await, list to events.
    res.status(200).send({
      message: "Your gift has been unwrapped.",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({
      message: error.message || "Internal Server Error",
    });
  }
}
