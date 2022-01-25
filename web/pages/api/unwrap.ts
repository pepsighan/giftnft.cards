import { NextApiRequest, NextApiResponse } from "next";

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

  // TODO: Send the request using admin's wallet.
}
