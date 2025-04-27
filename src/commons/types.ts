import { TokenType } from "../tokens/types";

// type for the transaction statement
export interface Transaction {
    transactionHash: string;
    blockHash: string;
    blockNumber: bigint;
    timestamp?: string;
    from: string | undefined;
    to: string | undefined;
    amount: bigint | undefined;
    fee: string,
    transactionType: TokenType; // ETH, ERC20, ERC721, ERC1155
    // isContractInteraction: boolean; can be a separate field to differentiate contract/EOA interactions
    assetContractAddress: string;
    metadata?: object // decimals for erc20 and tokenID for erc721, etc.
}