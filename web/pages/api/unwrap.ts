import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import config from "utils/config";
import { convertGiftCardTupleToObject } from "utils/conversion";

/**
 * Get address of the wallet from signature.
 */
function getAddressFromSignature(
  tokenId: string,
  owner: string,
  signature: string
): boolean {
  const msgHash = ethers.utils.solidityKeccak256(
    ["uint256", "address"],
    [tokenId, owner]
  );
  const address = ethers.utils.verifyMessage(
    ethers.utils.arrayify(msgHash),
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

  const { tokenId, owner, signature } = req.body ?? {};
  if (!tokenId || !owner || !signature) {
    return res.status(400).send({
      message: "Requires `tokenId`, `owner` and `signature` to be present",
    });
  }

  try {
    const isValidRequest = getAddressFromSignature(tokenId, owner, signature);
    if (!isValidRequest) {
      return res.status(400).send({
        message: "Invalid signature",
      });
    }

    const provider = new ethers.providers.JsonRpcProvider(
      config.HTTP_RPC_ENDPOINT
    );

    const signer = new ethers.Wallet(config.ADMIN_PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(
      config.CONTRACT_ADDRESS,
      config.CONTRACT_ABI,
      signer
    );

    const giftCardTuple = await contract.getGiftCardByAdmin(tokenId);
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
      signature
    );

    const txFee = gasLimit.mul(gasPrice);
    await contract.unwrapGiftCardByAdmin(tokenId, owner, signature, txFee, {
      gasPrice,
      gasLimit,
    });
    // TODO: Because transactions are not resolved using the async-await, list to events.
    res.status(200).send({
      message: "Your gift has been unwrapped.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
}
