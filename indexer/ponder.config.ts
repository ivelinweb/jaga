import { createConfig } from "ponder";
import { http } from "viem";
import { ERC20_ABI, JAGA_STAKE_ABI } from "./abis/StakeAbi";

export default createConfig({
  chains: {
    hederaTestnet: {
      id: 296,
      rpc: http(process.env.RPC_URL ?? "https://296.rpc.thirdweb.com"),
    },
  },
  contracts: {
    JagaStake: {
      chain: "hederaTestnet",
      address:
        (process.env.JAGA_STAKE_ADDRESS as `0x${string}`) ??
        ("0x0000000000000000000000000000000000000000" as `0x${string}`),
      abi: JAGA_STAKE_ABI,
      startBlock: process.env.JAGA_STAKE_START_BLOCK
        ? Number(process.env.JAGA_STAKE_START_BLOCK)
        : 0,
    },
    JagaToken: {
      chain: "hederaTestnet",
      address:
        (process.env.JAGA_TOKEN_ADDRESS as `0x${string}`) ??
        ("0x0000000000000000000000000000000000000000" as `0x${string}`),
      abi: ERC20_ABI,
      startBlock: process.env.JAGA_TOKEN_START_BLOCK
        ? Number(process.env.JAGA_TOKEN_START_BLOCK)
        : 0,
    },
    USDC: {
      chain: "hederaTestnet",
      address:
        (process.env.USDC_ADDRESS as `0x${string}`) ??
        ("0x0000000000000000000000000000000000000000" as `0x${string}`),
      abi: ERC20_ABI,
      startBlock: process.env.USDC_START_BLOCK
        ? Number(process.env.USDC_START_BLOCK)
        : 0,
    },
  },
});
