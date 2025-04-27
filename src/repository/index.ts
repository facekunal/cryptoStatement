import { Transaction } from "../commons/types";
import * as fs from "fs-extra";
import * as path from "path";

/**
 * CSVExporter provides static methods to export an array of Transaction objects
 * to a CSV file. The output file path must be set before exporting.
 *
 * Usage:
 *   CSVExporter.setOutputFile("path/to/output.csv");
 *   await CSVExporter.export(transactions);
 */
export class CSVExporter {
    /**
     * The output file path where the CSV will be written.
     */
    private static outputFile: string;

    /**
     * Sets the output file path for the CSV export.
     * @param filePath The path to the output CSV file.
     */
    public static setOutputFile(filePath: string): void {
        this.outputFile = filePath;
    }

    /**
     * Exports the provided transactions to a CSV file at the configured output path.
     * Ensures the output directory exists before writing.
     *
     * @param transactions Array of Transaction objects to export.
     * @throws {Error} If the output file path is not set.
     */
    public static async export(transactions: Transaction[]): Promise<void> {
        if (!this.outputFile) {
            throw new Error("Output file path is not set. Use setOutputFile() before exporting.");
        }

        console.log(`Transaction history export started to ${this.outputFile}`);

        // Ensure the directory exists
        const outputDir = path.dirname(this.outputFile);
        await fs.ensureDir(outputDir);

        const csvHeader = [
            "Transaction Hash",
            "Block Hash",
            "Block Number",
            "Timestamp",
            "From",
            "To",
            "Token Amount",
            "Transaction Type",
            "Asset Contract Address",
            "Asset Metadata",
        ];
        const csvRows = transactions.map((tx) => [
            tx.transactionHash,
            tx.blockHash,
            tx.blockNumber.toString(),
            "", // TODO: Add timestamp
            tx.from || "",
            tx.to || "",
            tx.amount?.toString() || "0",
            tx.transactionType,
            tx.assetContractAddress,
            JSON.stringify(tx.metadata || ""),
        ]);

        const csvContent = [csvHeader, ...csvRows]
            .map((row) => row.join(","))
            .join("\n");

        await fs.writeFile(this.outputFile, csvContent, "utf8");
        console.log(`Transaction history exported successfully to ${this.outputFile}`);
    }
}
