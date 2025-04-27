import { Transaction, TransferType } from "../commons/types";
import { Erc1155Fetcher } from "./erc1155";
import { Erc20Fetcher } from "./erc20";
import { Erc721Fetcher } from "./erc721";
import { EthFetcher } from "./eth";

/**
 * Fetches transactions for a given wallet address using the appropriate fetcher.
 *
 * @param walletAddress The wallet address to fetch transactions for.
 * @returns Promise resolving to an array of Transaction objects.
 */
export async function fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]> {
    // Note: can be done for all TransferTypes in Promise
    const fetcher = TransactionFetcherFactory.getFetcher(TransferType.ERC20);
    const transactions = await fetcher.fetchTransactions(walletAddress);

    return transactions;
}

/**
 * Interface for transaction fetchers. Each fetcher should implement this interface
 * to provide a method for fetching transactions for a given wallet address.
 */
export interface TransactionFetcher {
    fetchTransactions(walletAddress: `0x${string}`): Promise<Transaction[]>;
}
  
/**
 * Factory class to instantiate the correct TransactionFetcher based on the transfer type.
 */
class TransactionFetcherFactory {
  /**
   * Returns an instance of the appropriate TransactionFetcher for the given transfer type.
   * @param transferType The type of transfer (ETH, ERC20, ERC721, ERC1155).
   * @returns An instance of a class implementing TransactionFetcher.
   * @throws {Error} If the transfer type is unsupported.
   */
  static getFetcher(transferType: TransferType): TransactionFetcher {
    switch (transferType) {
      case TransferType.ETH:
        return new EthFetcher();
      case TransferType.ERC20:
        return new Erc20Fetcher();
      case TransferType.ERC721:
        return new Erc721Fetcher();
      case TransferType.ERC1155:
        return new Erc1155Fetcher();
      default:
        throw new Error(`Unsupported token type: ${transferType}`);
    }
  }
}
