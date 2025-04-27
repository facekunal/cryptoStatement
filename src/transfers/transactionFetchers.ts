import { Transaction } from "../commons/types";
import { TransactionFetcher } from ".";
import { fetchERC1155TransactionsFromMoralis, fetchERC20TransactionsFromBlockscout, fetchERC20TransactionsFromEtherscan, fetchERC721TransactionsFromBlockscout, fetchERC721TransactionsFromEtherscan, fetchETHTransactionsFromBlockscout, fetchETHTransactionsFromEtherscan } from "./externalApis";

export class Erc20Fetcher implements TransactionFetcher {

  async fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
    console.log("Fetching ERC20 transactions...");
    const fetchers = [fetchERC20TransactionsFromBlockscout, fetchERC20TransactionsFromEtherscan];
    
      for (const fetcher of fetchers) {
        try {
          return await fetcher(walletAddress);
        } catch (error) {
          console.error(`${fetcher.name} error:`, error);
        }
      }
      throw new Error("Failed to fetch transactions from all available APIs.");
  }
}

export class Erc721Fetcher implements TransactionFetcher {
  async fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
    console.log("Fetching ERC721 transactions...");
    const fetchers = [fetchERC721TransactionsFromBlockscout, fetchERC721TransactionsFromEtherscan];

    for (const fetcher of fetchers) {
      try {
        return await fetcher(walletAddress);
      } catch (error) {
        console.error(`${fetcher.name} error:`, error);
      }
    }
    throw new Error("Failed to fetch ERC721 transactions from all available APIs.");
  }
}

export class Erc1155Fetcher implements TransactionFetcher {
  async fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
    console.log("Fetching ERC1155 transactions...");
    const fetchers = [fetchERC1155TransactionsFromMoralis];

    for (const fetcher of fetchers) {
      try {
        return await fetcher(walletAddress);
      } catch (error) {
        console.error(`${fetcher.name} error:`, error);
      }
    }
    throw new Error("Failed to fetch ERC1155 transactions from all available APIs.");
  }
}

export class EthFetcher implements TransactionFetcher {
  async fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
    console.log("Fetching ETH native transactions...");
    const fetchers = [fetchETHTransactionsFromBlockscout, fetchETHTransactionsFromEtherscan];

    for (const fetcher of fetchers) {
      try {
        return await fetcher(walletAddress);
      } catch (error) {
        console.error(`${fetcher.name} error:`, error);
      }
    }
    throw new Error("Failed to fetch ETH transactions from all available APIs.");
  }
}
