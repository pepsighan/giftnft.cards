import contractAbi from "utils/contractAbi";

const config = {
  CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!),
  CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
  CONTRACT_ABI: contractAbi,
  TESTNET_HTTP_RPC_ENDPOINT: process.env.TESTNET_HTTP_RPC_ENDPOINT,
  TESTNET_ADMIN_PRIVATE_KEY: process.env.TESTNET_ADMIN_PRIVATE_KEY,
  MAINNET_HTTP_RPC_ENDPOINT: process.env.MAINNET_HTTP_RPC_ENDPOINT,
  MAINNET_ADMIN_PRIVATE_KEY: process.env.MAINNET_ADMIN_PRIVATE_KEY,
};

if (!config.CONTRACT_ADDRESS || !config.CHAIN_ID) {
  throw new Error("environment is not configured");
}

export default config;
