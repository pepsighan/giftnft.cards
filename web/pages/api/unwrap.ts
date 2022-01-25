import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import config from "utils/config";

/**
 * Get address of the wallet from signature.
 */
function getAddressFromSignature(
  tokenId: number,
  owner: string,
  signature: string
): boolean {
  // The algorithm to extract signature is the same as in solidity.
  const sig = ethers.utils.splitSignature(signature);
  const msgHash = ethers.utils.solidityKeccak256(
    ["uint256", "address"],
    [tokenId, owner]
  );
  const prefixedHash = ethers.utils.solidityKeccak256(
    ["string", "string"],
    ["\x19Ethereum Signed Message:\n32", msgHash]
  );
  const address = ethers.utils.recoverAddress(prefixedHash, sig);
  return address === owner;
}

/**
 * Unwrap the gift card using the admin account itself so that the user does not have to pay for
 * the transaction.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(404).send({
      message: "Not found",
    });
  }

  const { tokenId, owner, signature } = req.body ?? {};
  if (!tokenId || !owner || !signature) {
    return res.status(400).send({
      message: "Bad request",
    });
  }

  const isValidRequest = getAddressFromSignature(tokenId, owner, signature);
  if (!isValidRequest) {
    return res.status(400).send({
      message: "Bad request",
    });
  }

  const provider = new ethers.providers.JsonRpcProvider({
    url: config.HTTP_RPC_ENDPOINT!,
  });
  // TODO: Send the request using admin's wallet.
}
