import USDC_JSON from "./USDC_ABI.json";
import JAGATOKEN_JSON from "./JAGA_TOKEN_ABI.json";
import JAGASTAKE_JSON from "./JAGA_STAKE_ABI.json";
import INSURANCE_MANAGER_JSON from "./INSURANCE_MANAGER_ABI.json";
import CLAIM_MANAGER_JSON from "./CLAIM_MANAGER_ABI.json";
import DAO_GOVERNANCE_JSON from "./DAO_GOVERNANCE_ABI.json";
import ERC20_ABI_JSON from "./ERC20_ABI.json";
import MORPHO_ABI_JSON from "./MORPHO_ABI.json";
import MORPHO_REINVEST_ABI_JSON from "./MORPHO_REINVEST_ABI.json";

export const ERC20_ABI = ERC20_ABI_JSON;
export const USDC_ABI = USDC_JSON;
export const JAGA_TOKEN_ABI = JAGATOKEN_JSON;
export const JAGA_STAKE_ABI = JAGASTAKE_JSON;
export const INSURANCE_MANAGER_ABI = INSURANCE_MANAGER_JSON;
export const CLAIM_MANAGER_ABI = CLAIM_MANAGER_JSON;
export const DAO_GOVERNANCE_ABI = DAO_GOVERNANCE_JSON;
export const MORPHO_ABI = MORPHO_ABI_JSON;
export const MORPHO_REINVEST_ABI = MORPHO_REINVEST_ABI_JSON;

// Helper to satisfy viem address template literal type
const toAddress = (s: string) => s as `0x${string}`;


export const CONTRACTS = {
  USDC: toAddress(
    process.env.NEXT_PUBLIC_USDC_ADDRESS ??
      "0x0000000000000000000000000000000000000000"
  ),
  JAGA_TOKEN: toAddress(
    process.env.NEXT_PUBLIC_JAGA_TOKEN_ADDRESS ??
      "0x0000000000000000000000000000000000000000"
  ),
  INSURANCE_MANAGER: toAddress(
    process.env.NEXT_PUBLIC_INSURANCE_MANAGER_ADDRESS ??
      "0x0000000000000000000000000000000000000000"
  ),
  JAGA_STAKE: toAddress(
    process.env.NEXT_PUBLIC_JAGA_STAKE_ADDRESS ??
      "0x0000000000000000000000000000000000000000"
  ),
  MORPHO: toAddress(
    process.env.NEXT_PUBLIC_MORPHO_VAULT_ADDRESS ??
      "0x0000000000000000000000000000000000000000"
  ),
  CLAIM_MANAGER: toAddress(
    process.env.NEXT_PUBLIC_CLAIM_MANAGER_ADDRESS ??
      "0x0000000000000000000000000000000000000000"
  ),
  DAO_GOVERNANCE: toAddress(
    process.env.NEXT_PUBLIC_DAO_GOVERNANCE_ADDRESS ??
      "0x0000000000000000000000000000000000000000"
  ),
  MORPHO_REINVEST: toAddress(
    process.env.NEXT_PUBLIC_MORPHO_REINVEST_ADDRESS ??
      "0x0000000000000000000000000000000000000000"
  ),
} as const;

// Token configurations
export const TOKENS = {
  JAGA: {
    address: CONTRACTS.JAGA_TOKEN,
    symbol: "JAGA",
    name: "JagaDAO Token",
    decimals: 6,
    logo: "🛡️",
  },
  USDC: {
    address: CONTRACTS.USDC,
    symbol: "USDC",
    name: "USDC",
    decimals: 6,
    logo: "💵",
  },
} as const;
