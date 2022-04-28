import contractAbi from 'utils/contractAbi';

const config = {
  TESTNET_CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_TESTNET_CHAIN_ID!),
  TESTNET_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS!,
  MAINNET_CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_MAINNET_CHAIN_ID!),
  MAINNET_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ADDRESS!,
  CONTRACT_ABI: contractAbi,
};

if (
  !config.TESTNET_CONTRACT_ADDRESS ||
  !config.MAINNET_CONTRACT_ADDRESS ||
  !config.TESTNET_CHAIN_ID ||
  !config.MAINNET_CHAIN_ID
) {
  throw new Error('environment is not configured');
}

export default config;
