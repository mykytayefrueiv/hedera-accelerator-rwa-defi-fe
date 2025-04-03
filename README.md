# 🏙️ Hedera RWA DeFi Accelerator – Frontend

Welcome to the frontend of the **Hedera RWA DeFi Accelerator** – a reference dApp for building, managing, and interacting with tokenized real estate assets on Web3. This is the user interface layer for a modular REIT system that models real estate as on-chain assets, designed with composability, investor accessibility, and DeFi integration in mind.

> 💡 This project is a **reference architecture** for tokenizing real-world assets (RWAs) on Hedera. It is not intended to run on mainnet or represent real financial instruments. 

---

## 📦 Features

This frontend is structured around the idea that **each building is a unique NFT-backed identity**, with attached metadata, tokenized ownership, and integrated DeFi flows.

### ✅ Core Building Blocks

- **🧱 Building NFTs (ERC-721 + Metadata)**
  - Unique NFT for each property with IPFS-backed metadata
  - Editable and freezable attributes (e.g. year built, COPE data)

- **💸 Tokenized Ownership (ERC-20 or ERC-3643)**
  - Regulated fungible tokens for shareholding
  - Geo and cap-based transfer restrictions

- **💰 Vaults (ERC-4626 & ERC-7540)**
  - Real yield and streaming revenue distribution
  - Async vaults for smoother high-volume DeFi integrations

- **🔁 Autocompounders**
  - Automatic reinvestment of yield
  - Growth of token holdings without manual claiming

- **🏛️ DAO Governance**
  - Proposals, voting, and treasury management
  - Multi-role controls for admin, investor, auditor

- **📈 Pricing & Liquidity**
  - One-sided and two-sided market support

- **🏗️ Slices**
  - Curated investment baskets (e.g. luxury, regional blends)
  - Built for diversification and tailored exposure

---

## 🧭 Directory Overview

The frontend follows a modular structure built on **Next.js**:

```
app/                → Page routing
  └── admin/        → Admin tools
  └── building/     → Individual building views, interactions
  └── dash/         → Dashboard and analytics
  └── explorer/     → Browse buildings and slices
  └── slices/       → Slice management
components/         → All reusable UI elements
hooks/              → Web3 data hooks
services/           → IPFS, and contract interaction logic
consts/             → Token, building, slice constants
utils/              → Date helpers
```

---

## 🧪 Getting Started

### 1. Install dependencies

```
cd packages/fe-tw
yarn install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local` and fill in the following:

```
WALLETCONNECT_ID=
PINATA_API_KEY=
PINATA_API_SECRET=
HEDERA_NETWORK=testnet
```

You’ll also want your **Treasury account**, **Private key**, and **Contract addresses** (from the backend / deploy scripts).

### 3. Run the app

```
cd packages/fe-tw
yarn dev
```

---

## 🔓 Connect Wallets

This app supports:
- MetaMask (for EVM-compatible accounts)
- HashPack (for native Hedera integration via WalletConnect)

Features like **building creation**, **governance updates** and **vault deposits** are available once authenticated.

---

## 📊 Key Workflows

### 🏢 Deploy a New Building
- Mint a building NFT with metadata URI and Building Token
- Create a vault, treasury and governance
- Add building to slices

### 📥 Add Revenue / 📤 Record Expenses
- Push USDC into building treasury
- Trigger real-yield distributions via vaults
- Submit and approve expenses via multisig/DAO

### 💸 Trade & Stake
- Swap building tokens for USDC (AMM)
- Stake tokens into vaults for streaming rewards
- Let autocompounders grow your stake over time

---

## 🧠 Architectural Philosophy

This project uses **Ethereum-compatible standards** like:

- ERC-721 for unique buildings
- ERC-3643 for compliant fungible shares
- ERC-4626 and ERC-7540 for flexible DeFi vaults

---

## 🛠️ Dev Resources

Backend Code:
 - [Hedera RWA DeFI Accelerator Backend Repository](https://github.com/hashgraph/accelerator-defi-eip)

Blog Series on Tokenized Real Estate:
- [How Would We Build a REIT Today Using Web3 Technologies?](https://hedera.com/blog/how-would-we-build-a-reit-today-using-web3-technologies)
- [How Is Tokenization Changing The Way We Invest? ](https://hedera.com/blog/how-is-tokenization-changing-the-way-we-invest)
- [How can we model a building in Web3?](https://hedera.com/blog/how-can-we-model-a-building-in-web3)

Other Resources:
- [ERC-3643](https://www.erc3643.org/)
- [ERC-7540 Draft Standard](https://eips.ethereum.org/EIPS/eip-7540)
- [Pinata IPFS Docs](https://docs.pinata.cloud)

---

## 🤝 Contributing

This is an open-source reference implementation. If you want to contribute:

- Create components for new building phases (eg insurance)
- Improve UX 
- Help index building metadata for advanced filtering

PRs are welcome!

---

## ⚠️ Disclaimer

This dApp is for demonstration and educational purposes only. It is **not a financial product**, and no real assets are managed or sold via this platform.

---

## 💬 Questions?

Feel free to open an issue or reach out via the [Hedera Discord](https://hedera.com/discord). We’d love your feedback as we shape the RWA stack for Web3.
