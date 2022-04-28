import config from './config';

/**
 * Gets the network configuration to connect and execute transactions.
 */
export default function getMetisNetworkConfig(environment: string) {
  switch (environment) {
    case 'mainnet':
      return {
        endpoint: process.env.MAINNET_HTTP_RPC_ENDPOINT!,
        privateKey: process.env.MAINNET_ADMIN_PRIVATE_KEY!,
        chainId: config.MAINNET_CHAIN_ID,
        contractAddress: config.MAINNET_CONTRACT_ADDRESS,
      };
    case 'testnet':
      return {
        endpoint: process.env.TESTNET_HTTP_RPC_ENDPOINT!,
        privateKey: process.env.TESTNET_ADMIN_PRIVATE_KEY!,
        chainId: config.TESTNET_CHAIN_ID,
        contractAddress: config.TESTNET_CONTRACT_ADDRESS,
      };
    default:
      throw new Error('unreachable');
  }
}
