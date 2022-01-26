import contractAbi from "utils/contractAbi";

const config = {
  CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!),
  CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
  CONTRACT_ABI: contractAbi,
  HTTP_RPC_ENDPOINT: process.env.HTTP_RPC_ENDPOINT,
};

if (!config.CONTRACT_ADDRESS || !config.CHAIN_ID) {
  throw new Error("environment is not configured");
}

export default config;
