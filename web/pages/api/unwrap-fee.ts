import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import config from "utils/config";
import { convertGiftCardTupleToObject } from "utils/conversion";

/**
 * Unwrap the gift card using the admin account itself so that the user does not have to pay for
 * the transaction.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(404).send({
      message: "Not found",
    });
  }

  const { tokenId, owner } = req.query ?? {};
  if (!tokenId || !owner) {
    return res.status(400).send({
      message: "Requires `tokenId` and `owner` to be present",
    });
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(
      config.HTTP_RPC_ENDPOINT
    );

    const signer = new ethers.Wallet(config.ADMIN_PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(
      config.CONTRACT_ADDRESS,
      config.CONTRACT_ABI,
      signer
    );

    const gasPrice = await signer.getGasPrice();
    const gasLimit = await contract.estimateGas.unwrapGiftCardByAdmin(
      tokenId,
      owner,
      // A dummy signature and tx fee just to estimate.
      "FCF99243A75A461D87FE8FC",
      ethers.BigNumber.from(1e12)
    );

    const txFee = gasLimit.mul(gasPrice);

    // Balance of the admin account.
    const balance = await signer.getBalance();

    // If the tx fee is more than the balance, then cannot unwrap.
    const disabled = balance.lte(txFee);

    res.status(200).send({
      txFee,
      isUnwrappable: !disabled,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
}
