import contractAbi from "utils/contractAbi";

const config = {
  TESTNET_CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_TESTNET_CHAIN_ID!),
  TESTNET_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS!,
  MAINNET_CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_MAINNET_CHAIN_ID!),
  MAINNET_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ADDRESS!,
  CONTRACT_ABI: contractAbi,
  TESTNET_HTTP_RPC_ENDPOINT: process.env.TESTNET_HTTP_RPC_ENDPOINT,
  TESTNET_ADMIN_PRIVATE_KEY: process.env.TESTNET_ADMIN_PRIVATE_KEY,
  MAINNET_HTTP_RPC_ENDPOINT: process.env.MAINNET_HTTP_RPC_ENDPOINT,
  MAINNET_ADMIN_PRIVATE_KEY: process.env.MAINNET_ADMIN_PRIVATE_KEY,
};

if (
  !config.TESTNET_CONTRACT_ADDRESS ||
  !config.MAINNET_CONTRACT_ADDRESS ||
  !config.TESTNET_CHAIN_ID ||
  !config.MAINNET_CHAIN_ID
) {
  throw new Error("environment is not configured");
}

/**
 * Gets the network configuration to connect and execute transactions.
 */
export function getMetisNetworkConfig(environment: string) {
  switch (environment) {
    case "mainnet":
      return {
        endpoint: config.MAINNET_HTTP_RPC_ENDPOINT,
        privateKey: config.MAINNET_ADMIN_PRIVATE_KEY,
        chainId: config.MAINNET_CHAIN_ID,
        contractAddress: config.MAINNET_CONTRACT_ADDRESS,
      };
    case "testnet":
      return {
        endpoint: config.TESTNET_HTTP_RPC_ENDPOINT,
        privateKey: config.TESTNET_ADMIN_PRIVATE_KEY,
        chainId: config.TESTNET_CHAIN_ID,
        contractAddress: config.TESTNET_CONTRACT_ADDRESS,
      };
    default:
      throw new Error("unreachable");
  }
}

export default config;
