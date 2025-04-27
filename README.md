# cryptoStatement
Retrieves transaction history for a specified Ethereum wallet address.

## Features

- Fetches ERC20, ERC721, ERC1155, and native ETH transactions for a given wallet.
- Supports multiple data sources (Blockscout, Etherscan, Moralis).
- Handles multiple RPC endpoints for reliability.

## Setup

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Configure environment variables:**
   - Create a `.env` file in the project root.
   - Add your Etherscan and Moralis API keys:
     ```
     ETHERSCAN_API_KEY=your_etherscan_api_key
     MORALIS_API_KEY=your_moralis_api_key
     ```

## Usage

```bash
yarn start
```

You will be prompted to enter a wallet address.

## Project Structure

- `src/`
  - `transfers/`  
    Contains logic for fetching transactions for various token standards.
    - `externalApis/` – API-specific fetchers (Blockscout, Etherscan, Moralis, etc.)
    - `transactionFetchers.ts` – Classes for each token type to coordinate fetching.
    - `index.ts` – Main entry for fetching all transactions for a wallet.
  - `tokens/`  
    Token type definitions, NFT standard detection, and token metadata utilities.
  - `commons/`  
    Shared types and configuration.
  - `networks/`  
    Blockchain network client management and utilities.
- `.env`  
  Environment variables for API keys.
- `README.md`  
  Project documentation.

## Note

- There is a limit on total blocks to be fetched and it's configurable in src/commons/config.ts.
- Some apis are pagination and handling will be required for large block range.

## License

MIT
