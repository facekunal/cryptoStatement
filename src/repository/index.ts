import { Transaction } from "../commons/types";
import * as fs from "fs-extra";
import * as path from "path";

export async function exportToCSV(transactions: Transaction[], outputFile: string): Promise<void> {
    console.log(`Transaction history export started to ${outputFile}`);

    // Ensure the directory exists
    const outputDir = path.dirname(outputFile);
    await fs.ensureDir(outputDir);

    const csvHeader = [
        "Transaction Hash",
        "Block Hash",
        "Block Number",
        "From",
        "To",
        "Token Amount",
        "Transaction Type",
        "Asset Contract Address",
    ];
    const csvRows = transactions.map((tx) => [
        tx.transactionHash,
        tx.blockHash,
        tx.blockNumber.toString(),
        tx.from || "",
        tx.to || "",
        tx.amount?.toString() || "0",
        tx.transactionType,
        tx.assetContractAddress,
    ]);

    const csvContent = [csvHeader, ...csvRows]
        .map((row) => row.join(","))
        .join("\n");

    await fs.writeFile(outputFile, csvContent, "utf8");
    console.log(`Transaction history exported successfully to ${outputFile}`);
}