import axios from "axios";
import { TOTAL_BLOCKS } from "../../commons/config";
import { Network } from "../../networks";
import { Transaction } from "../../commons/types";
import { TokenType } from "../../tokens/types";
import { detectNFTStandard } from "../../tokens";
import 'dotenv/config';

/**
 * Fetches ERC20 token transactions for a wallet address from Blockscout API.
 * @param walletAddress Wallet address in `0x${string}` format.
 * @returns Promise resolving to an array of Transaction objects.
 * @throws Error if the API call fails or returns an error status.
 */
export async function fetchERC20TransactionsFromBlockscout(walletAddress: `0x${string}`): Promise<Transaction[]> {
  try {
    const latestBlockNumber = await Network.fetchLatestBlockNumber();
    const startblock = latestBlockNumber - TOTAL_BLOCKS;

    const url = `https://blockscout.com/eth/mainnet/api?module=account&action=tokentx&address=${walletAddress}&startblock=${startblock}&endblock=${latestBlockNumber}&sort=desc`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "1") {
      throw new Error(`Error fetching transactions: ${data.message}`);
    }

    // transform the transactions to match the Transaction type
    const transformedTransactions = data.result.map((tx: any) => ({
      transactionHash: tx.hash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      timeStamp: tx.timeStamp,
      from: tx.from,
      to: tx.to,
      amount: tx.value,
      fee: calculateFee(tx.gasPrice, tx.gasUsed),
      transactionType: TokenType.ERC20,
      assetContractAddress: tx.contractAddress,
      metadata: {
        name: tx.tokenName,
        symbol: tx.tokenSymbol,
        decimals: tx.tokenDecimal,
      }
    }));
    return transformedTransactions;
  } catch (error: any) {
    console.error("Blockscout API error:", error?.message || error);
    return [];
  }
}

/**
 * Fetches ERC20 token transactions for a wallet address from Etherscan API.
 * @param walletAddress Wallet address in `0x${string}` format.
 * @returns Promise resolving to an array of Transaction objects.
 * @throws Error if the API key is missing, the API call fails, or returns an error status.
 */
export async function fetchERC20TransactionsFromEtherscan(walletAddress: `0x${string}`): Promise<Transaction[]> {
  try {
    const latestBlockNumber = await Network.fetchLatestBlockNumber();
    const startblock = latestBlockNumber - TOTAL_BLOCKS;

    const apiKey = process.env.ETHERSCAN_API_KEY;
    if (!apiKey) {
      throw new Error("Etherscan API key is not set in the environment variables");
    }
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${walletAddress}&startblock=${startblock}&endblock=${latestBlockNumber}&page=${0}&offset=${0}&sort=desc&apikey=${apiKey}`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "1") {
      throw new Error(`Error fetching transactions: ${data.message}`);
    }

    // transform the transactions to match the Transaction type
    const transformedTransactions = data.result.map((tx: any) => ({
      transactionHash: tx.hash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      timeStamp: tx.timeStamp,
      from: tx.from,
      to: tx.to,
      amount: tx.value,
      fee: calculateFee(tx.gasPrice, tx.gasUsed),
      transactionType: TokenType.ERC20,
      assetContractAddress: tx.contractAddress,
      metadata: {
        name: tx.tokenName,
        symbol: tx.tokenSymbol,
        decimals: tx.tokenDecimal,
      }
    }));
    return transformedTransactions;
  } catch (error: any) {
    console.error("Etherscan API error:", error?.message || error);
    return [];
  }
}

/**
 * Fetches NFT token transactions for a wallet address from Blockscout API.
 * @param walletAddress Wallet address in `0x${string}` format.
 * @returns Promise resolving to an array of Transaction objects.
 * @throws Error if the API call fails or returns an error status.
 */
export async function fetchERC721TransactionsFromBlockscout(walletAddress: `0x${string}`): Promise<Transaction[]> {
  try {
    const latestBlockNumber = await Network.fetchLatestBlockNumber();
    const startblock = latestBlockNumber - TOTAL_BLOCKS;

    const url = `https://blockscout.com/eth/mainnet/api?module=account&action=tokennfttx&address=${walletAddress}&startblock=${startblock}&endblock=${latestBlockNumber}&sort=desc`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "1") {
      throw new Error(`Error fetching NFT transactions: ${data.message}`);
    }

    const transformedTransactions = await Promise.all(
      data.result.map(async (tx: any) => ({
        transactionHash: tx.hash,
        blockHash: tx.blockHash,
        blockNumber: tx.blockNumber,
        timeStamp: tx.timeStamp,
        from: tx.from,
        to: tx.to,
        amount: "1", // NFTs are usually transferred as single units
        fee: calculateFee(tx.gasPrice, tx.gasUsed),
        transactionType: await detectNFTStandard(tx.contractAddress),
        assetContractAddress: tx.contractAddress,
        metadata: {
          name: tx.tokenName,
          symbol: tx.tokenSymbol,
          tokenId: tx.tokenID,
        }
      }))
    );
    return transformedTransactions;
  } catch (error: any) {
    console.error("Blockscout NFT API error:", error?.message || error);
    return [];
  }
}

/**
 * Fetches NFT token transactions for a wallet address from Etherscan API.
 * @param walletAddress Wallet address in `0x${string}` format.
 * @returns Promise resolving to an array of Transaction objects.
 * @throws Error if the API key is missing, the API call fails, or returns an error status.
 */
export async function fetchERC721TransactionsFromEtherscan(walletAddress: `0x${string}`): Promise<Transaction[]> {
  try {
    const latestBlockNumber = await Network.fetchLatestBlockNumber();
    const startblock = latestBlockNumber - TOTAL_BLOCKS;

    const apiKey = process.env.ETHERSCAN_API_KEY;
    if (!apiKey) {
      throw new Error("Etherscan API key is not set in the environment variables");
    }
    const url = `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${walletAddress}&startblock=${startblock}&endblock=${latestBlockNumber}&page=${0}&offset=${0}&sort=desc&apikey=${apiKey}`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "1") {
      throw new Error(`Error fetching NFT transactions: ${data.message}`);
    }

    const transformedTransactions = await Promise.all(
      data.result.map(async (tx: any) => ({
        transactionHash: tx.hash,
        blockHash: tx.blockHash,
        blockNumber: tx.blockNumber,
        timeStamp: tx.timeStamp,
        from: tx.from,
        to: tx.to,
        amount: "1", // NFTs are usually transferred as single units
        fee: calculateFee(tx.gasPrice, tx.gasUsed),
        transactionType: await detectNFTStandard(tx.contractAddress),
        assetContractAddress: tx.contractAddress,
        metadata: {
          name: tx.tokenName,
          symbol: tx.tokenSymbol,
          tokenId: tx.tokenID,
        }
      }))
    );
    return transformedTransactions;
  } catch (error: any) {
    console.error("Etherscan NFT API error:", error?.message || error);
    return [];
  }
}

/**
 * Fetch ERC1155 transactions for a given wallet address using the Moralis API.
 * @param {string} walletAddress - The wallet address to fetch ERC1155 transactions for.
 * @param {string} moralisApiKey - Your Moralis API key.
 * @returns {Array} A list of ERC1155 transactions.
 */
export async function fetchERC1155TransactionsFromMoralis(walletAddress: `0x${string}`): Promise<Transaction[]> {
  const url = `https://deep-index.moralis.io/api/v2/${walletAddress}/nft/transfers?chain=eth`;

  try {
    if (!process.env.MORALIS_API_KEY) {
      throw new Error("Moralis API key is not set in the environment variables");
    }
    // Make the API call to Moralis to fetch ERC1155 transfers
    const response = await axios.get(url, {
      headers: {
        'X-API-Key': process.env.MORALIS_API_KEY,
      },
    });

    // Check if the response contains any results
    if (response.data && response.data.result) {
      // Filter for ERC1155 transactions (token_type === 'ERC1155')
      const erc1155Transfers = response.data.result
        .filter((tx: { contract_type: string }) => tx.contract_type === 'ERC1155')
        .map((tx: any) => ({
          transactionHash: tx.transaction_hash,
          blockHash: tx.block_hash,
          blockNumber: tx.block_number,
          timeStamp: tx.block_timestamp,
          from: tx.from_address,
          to: tx.to_address,
          amount: tx.amount,
          fee: "",
          transactionType: TokenType.ERC1155,
          assetContractAddress: tx.token_address,
          metadata: {
            name: "",
            symbol: "",
            tokenId: tx.token_id
          },
        }));
      
      // Return the filtered ERC1155 transactions
      return erc1155Transfers;
    } else {
      throw new Error('No ERC1155 transfers found.');
    }
  } catch (error) {
    console.error('Error fetching ERC1155 transactions:', error);
    return [];
  }
}

/**
 * Fetches native ETH transactions for a wallet address from Blockscout API.
 * @param walletAddress Wallet address in `0x${string}` format.
 * @returns Promise resolving to an array of Transaction objects.
 * @throws Error if the API call fails or returns an error status.
 */
export async function fetchETHTransactionsFromBlockscout(walletAddress: `0x${string}`): Promise<Transaction[]> {
  try {
    const latestBlockNumber = await Network.fetchLatestBlockNumber();
    const startblock = latestBlockNumber - TOTAL_BLOCKS;

    const url = `https://blockscout.com/eth/mainnet/api?module=account&action=txlist&address=${walletAddress}&startblock=${startblock}&endblock=${latestBlockNumber}&sort=desc`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "1") {
      throw new Error(`Error fetching ETH transactions: ${data.message}`);
    }

    const transformedTransactions = data.result.map((tx: any) => ({
      transactionHash: tx.hash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      timeStamp: tx.timeStamp,
      from: tx.from,
      to: tx.to,
      amount: tx.value,
      fee: calculateFee(tx.gasPrice, tx.gasUsed),
      transactionType: TokenType.ETH,
      assetContractAddress: "NA", // ETH has no contract address
      metadata: {
        name: "ETH",
        symbol: "ETH",
        decimals: "18",
      }
    }));
    return transformedTransactions;
  } catch (error: any) {
    console.error("Blockscout ETH API error:", error?.message || error);
    return [];
  }
}

/**
 * Fetches native ETH transactions for a wallet address from Etherscan API.
 * @param walletAddress Wallet address in `0x${string}` format.
 * @returns Promise resolving to an array of Transaction objects.
 * @throws Error if the API key is missing, the API call fails, or returns an error status.
 */
export async function fetchETHTransactionsFromEtherscan(walletAddress: `0x${string}`): Promise<Transaction[]> {
  try {
    const latestBlockNumber = await Network.fetchLatestBlockNumber();
    const startblock = latestBlockNumber - TOTAL_BLOCKS;

    const apiKey = process.env.ETHERSCAN_API_KEY;
    if (!apiKey) {
      throw new Error("Etherscan API key is not set in the environment variables");
    }
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=${startblock}&endblock=${latestBlockNumber}&page=0&offset=0&sort=desc&apikey=${apiKey}`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.status !== "1") {
      throw new Error(`Error fetching ETH transactions: ${data.message}`);
    }

    const transformedTransactions = data.result.map((tx: any) => ({
      transactionHash: tx.hash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      timeStamp: tx.timeStamp,
      from: tx.from,
      to: tx.to,
      amount: tx.value,
      fee: calculateFee(tx.gasPrice, tx.gasUsed),
      transactionType: TokenType.ETH,
      assetContractAddress: "NA", // ETH has no contract address
      metadata: {
        name: "ETH",
        symbol: "ETH",
        decimals: "18",
      }
    }));
    return transformedTransactions;
  } catch (error: any) {
    console.error("Etherscan ETH API error:", error?.message || error);
    return [];
  }
}

function calculateFee(gasPrice: string, gasUsed: string): string {
  try {
    return (BigInt(gasPrice) * BigInt(gasUsed)).toString();
  } catch (error) {
    console.error("Error calculating fee:", error);
    return "";
  }
}