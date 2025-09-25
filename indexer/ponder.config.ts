import { createConfig } from "ponder";
import { http } from "viem";
import { ERC20_ABI, JAGA_STAKE_ABI } from "./abis/StakeAbi";

export default createConfig({
  chains: {
    hederaTestnet: {
      id: 296,
      rpc: http("https://testnet.hashio.io/api"),
    },
  },
  contracts: {
    JagaStake: {
      chain: "hederaTestnet",
      address: "0x0000000000000000000000000000000000000000", // TODO: update Hedera Testnet address
      abi: JAGA_STAKE_ABI,
      startBlock: 0, // TODO: set deployment block
    },
    JagaToken: {
      chain: "hederaTestnet",
      address: "0x0000000000000000000000000000000000000000", // TODO: update Hedera Testnet address
      abi: ERC20_ABI,
      startBlock: 0, // TODO: set deployment block
    },
    USDC: {
      chain: "hederaTestnet",
      address: "0x0000000000000000000000000000000000000000", // TODO: update Hedera Testnet address
      abi: ERC20_ABI,
      startBlock: 0, // TODO: set deployment block
    },
  },
});
