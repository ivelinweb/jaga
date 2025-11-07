<p align="center">
  <img src="frontend/public/jagantara_icon.png" alt="Jaga logo" width="120" />
</p>
<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-0ea5e9.svg" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/chain-Hedera%20Testnet%20(EVM)-7e22ce?logo=hedera" alt="Chain: Hedera Testnet (EVM)" />
  <img src="https://img.shields.io/badge/chain%20id-296-2563eb" alt="Chain ID 296" />
  <img src="https://img.shields.io/badge/frontend-Next.js%2014-000000?logo=nextdotjs" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/indexer-Ponder-0ea5e9" alt="Ponder" />
  <img src="https://img.shields.io/badge/contracts-Foundry-f97316" alt="Foundry" />
</p>

<hr/>

# Jaga — Decentralized Insurance for Digital Assets (Hedera EVM)

On‑chain, DAO‑governed insurance that protects crypto users and protocols with transparent claims, sustainable reserves, and a great UX. Built on Hedera EVM for fast, low‑cost finality.

---

## Table of Contents
- Overview
- Deployed Contracts (Hedera Testnet)
- External Dependencies (Reused)
- Monorepo Structure
- Quickstart
  - Environment
  - Run the Indexer (GraphQL)
  - Run the Frontend (Next.js)
  - Build Smart Contracts (Foundry)
- Addresses & Links
- Pitch Deck
- License

---

## Overview
Jaga delivers end‑to‑end, on‑chain insurance:
- Buy coverage, stake/earn, file claims, and govern payouts — all on‑chain
- Transparent claims adjudication via DAO governance
- Ponder indexer for fast querying and dashboards
- Conservative vault strategy module to help sustain reserves


## Data Flow

```text
[1] Staking & Indexing
────────────────────────────────────────────────────────────────────
User Wallet ──signs tx──> Next.js (useStake hook)
     |                       |
     |                       | 1) USDC.approve(JagaStake, amount)
     |                       | 2) JagaStake.stake(amount)
     v                       v
 Hedera EVM (JagaStake) ── emits events ──> Indexer (Ponder)
                                         └─► onchain tables:
                                            - stakes
                                            - unstakes
                                            - reward_claims
                                            - reward_sessions
                                         └─► GraphQL API (/graphql)
                                                     │
                                                     ▼
                                         Next.js (Apollo Client)
```

```text
[2] Premium Payment & Revenue Split
────────────────────────────────────────────────────────────────────
Next.js (useInsuranceManager)
   └── getPriceFromAmountTier() ─►
   └── USDC.approve(InsuranceManager, totalPremium) ─►
   └── payPremium(tier, duration, covered, amount) ─►
                           │
                           ▼
                    Hedera EVM (InsuranceManager)
                           │ monthly split
          ┌───────────────┼─────────────────────┬───────────────┐
          ▼               ▼                     ▼               ▼
   ClaimManager      JagaStake             Owner (20%)    MorphoReinvest
   (25% premiums)    (30% -> rewards)                       (25%)
          │               │                                  │
          ▼               ▼                                  ▼
   Payout vault     notifyRewardAmount()             Morpho Vault deposit
```

```text
[3] Claims Governance & Payout
────────────────────────────────────────────────────────────────────
User ── submitClaim(...) ─► DAOGovernance (Hedera EVM)
                               │ votes (JagaToken holders)
                               ▼
                      ┌─────────────────────────────────┐
                      │  Decision window:               │
                      │  - Approve if yes ≥ 66% after   │
                      │    ≥ 5 days                     │
                      │  - Reject if not reached after  │
                      │    7 days total                 │
                      └─────────────────────────────────┘
                               │
                ┌──────────────┴───────────────┐
                ▼                              ▼
         Approved                         Rejected
                │
                ▼
   ClaimManager (Hedera EVM).claimPayout(claimId) ─► USDC → claimant
```

## System Architecture

```text
                   +-----------------------+
                   |   Browser / Wallet    |
                   | (Reown, Xellar, wagmi)|
                   +-----------+-----------+
                               |
                               | UI + Tx signatures
                               v
+----------------------+       +------------------------------+
| Next.js Frontend     |<----->| Indexer (Ponder + Hono)      |
| (jaga-main)          |  HTTP | - Event listeners            |
| - React pages/hooks  | GraphQL| - onchain tables (stakes...) |
| - viem/wagmi/ethers  |       | - DB (Ponder-managed)        |
| - Apollo Client      |       | - /graphql, /sql endpoints   |
| - Jagabot (MCP)      |       +--------------+---------------+
+----------+-----------+                      ^
           |                                  |
           | EVM JSON-RPC                     | GraphQL queries
           v                                  |
+----------+-----------+    emits events      |
| Hedera EVM (Testnet) |----------------------+
| - InsuranceManager   |
| - JagaStake/JagaToken|
| - DAOGovernance      |
| - ClaimManager       |
| - MorphoReinvest     |
| - USDC, Morpho Vault |
+----------------------+
```


---

## Deployed Contracts (Hedera Testnet · Chain ID 296)
- InsuranceManager — `0xbDD1e681D19cE84E691C14f87B157CFf1c181625`
  - https://hashscan.io/testnet/address/0xbDD1e681D19cE84E691C14f87B157CFf1c181625
- JagaStake — `0xB4359c18D30DDe538cBD16b3206Edd6832DC2C1F`
  - https://hashscan.io/testnet/address/0xB4359c18D30DDe538cBD16b3206Edd6832DC2C1F
- JagaToken — `0x1b597ba645a8e6F81a499e91034D38eE9f0817Ff`
  - https://hashscan.io/testnet/address/0x1b597ba645a8e6F81a499e91034D38eE9f0817Ff
- DAOGovernance — `0x1599fb939C00E5a9b0A4764cE94701A65614bc5E`
  - https://hashscan.io/testnet/address/0x1599fb939C00E5a9b0A4764cE94701A65614bc5E
- ClaimManager — `0xED08E5b96a450f3000aeA8e1b7c7A746199B2757`
  - https://hashscan.io/testnet/address/0xED08E5b96a450f3000aeA8e1b7c7A746199B2757
- MorphoReinvest — `0x54E18c73f006dB44632349B2df2fc5F489a851Cd`
  - https://hashscan.io/testnet/address/0x54E18c73f006dB44632349B2df2fc5F489a851Cd

---

## External Dependencies (Reused on Hedera Testnet)
- USDC — `0x59b5E4796CCd2970850dFCA53D6Da6e5AFc9F7cC`
  - https://hashscan.io/testnet/address/0x59b5E4796CCd2970850dFCA53D6Da6e5AFc9F7cC
- Morpho Vault — `0xd14cCC0BeFd10e2E635c6ca72c174CA64782012d`
  - https://hashscan.io/testnet/address/0xd14cCC0BeFd10e2E635c6ca72c174CA64782012d

RPC: https://296.rpc.thirdweb.com

---

## Monorepo Structure
- frontend — Next.js 14 app (frontend)
- indexer — Ponder indexer (GraphQL API)
- smart-contract — Solidity contracts (Foundry)


---

## Quickstart
Prerequisites: Node.js 18+, npm, Foundry (for contracts), Git.

### 1) Environment
- Frontend: jaga/.env.local (already wired)
- Indexer: indexer/.env (already wired)
  - Ensure DATABASE_SCHEMA is set (e.g., `DATABASE_SCHEMA=app`)

### 2) Run the Indexer (GraphQL)
```bash
cd indexer
npm install
# Load env, set schema, and start
set -a && . ./.env && set +a && DATABASE_SCHEMA=app npm run start
# Health:   http://localhost:42069/health
# Ready:    http://localhost:42069/ready
# GraphQL:  http://localhost:42069/graphql
```

### 3) Run the Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:3000
```

### 4) Build Smart Contracts (Foundry)
```bash
cd smart-contract
forge build
forge test
# Deploy example:
# forge script script/DeployJaga.s.sol:DeployJaga --rpc-url $HEDERA_RPC --private-key $PK --broadcast --slow --legacy
```

---

## Addresses & Links
- Chain: Hedera Testnet (EVM) — chain id 296
- RPC: https://296.rpc.thirdweb.com
- HashScan: https://hashscan.io/testnet/evm

See also Jagahackathon.md for detailed architecture, plus hash links.

---

## Pitch Deck
- 

---

## License
MIT 

