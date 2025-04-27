import { Transaction } from "../commons/types";
import { getTokenInfo } from "../tokens";
import { TokenType } from "../tokens/types";
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
    const fetcher = TransactionFetcherFactory.getFetcher(TokenType.ERC20);
    let transactions = await fetcher.fetchTransactions(walletAddress);

    // for each item in transactions, get token info using getTokenInfo method then assign to item's metadata property
    console.log("Updating metadata for transactions...");
    for (const transaction of transactions) {
        const tokenInfo = await getTokenInfo(transaction.assetContractAddress, transaction.transactionType);
        if (tokenInfo) {
            transaction.metadata = tokenInfo;
        }
        // else don't update metadata
    }

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
  static getFetcher(transferType: TokenType): TransactionFetcher {
    switch (transferType) {
      case TokenType.ETH:
        return new EthFetcher();
      case TokenType.ERC20:
        return new Erc20Fetcher();
      case TokenType.ERC721:
        return new Erc721Fetcher();
      case TokenType.ERC1155:
        return new Erc1155Fetcher();
      default:
        throw new Error(`Unsupported token type: ${transferType}`);
    }
  }
}
