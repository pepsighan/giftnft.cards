import { withSentry } from '@sentry/nextjs';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import config from 'utils/config';
import getMetisNetworkConfig from 'utils/metisNetworkConfig';

/**
 * Unwrap the gift card using the admin account itself so that the user does not have to pay for
 * the transaction.
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(404).send({
      message: 'Not found',
    });
  }

  const { net } = req.query;
  if (net !== 'mainnet' && net !== 'testnet') {
    return res.status(404).send({
      message: 'Not found',
    });
  }

  const { tokenId, owner } = req.query ?? {};
  if (!tokenId || !owner) {
    return res.status(400).send({
      message: 'Requires `tokenId` and `owner` to be present',
    });
  }

  const { endpoint, privateKey, contractAddress } = getMetisNetworkConfig(net);
  if (!endpoint || !privateKey) {
    return res.status(500).send({
      message: 'Internal server error',
    });
  }

  try {
    const provider = new ethers.providers.JsonRpcProvider(endpoint);

    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(
      contractAddress,
      config.CONTRACT_ABI,
      signer
    );

    const gasPrice = await signer.getGasPrice();
    const gasLimit = await contract.estimateGas.unwrapGiftCardByAdmin(
      tokenId,
      owner,
      // A dummy tx fee just to estimate.
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
      message: 'Internal server error',
    });
  }
}

export default withSentry(handler);
