// TODO: Implement json to csv

// interface Transaction {
//     blockNumber: string;
//     timeStamp: string;
//     from: string;
//     to: string;
//     value: string;
//     gas: string;
//     gasPrice: string;
//     hash: string;
// }

// function exportToCSV(transactions: Transaction[], outputFile: string): void {
//     const csvHeader = [
//         "Block Number",
//         "Timestamp",
//         "From",
//         "To",
//         "Value (ETH)",
//         "Gas",
//         "Gas Price (Gwei)",
//         "Hash",
//     ];
//     const csvRows = transactions.map((tx) => [
//         tx.blockNumber,
//         new Date(parseInt(tx.timeStamp) * 1000).toISOString(), // Convert timestamp to ISO format
//         tx.from,
//         tx.to,
//         (parseInt(tx.value) / 10 ** 18).toFixed(18), // Convert Wei to ETH
//         tx.gas,
//         (parseInt(tx.gasPrice) / 10 ** 9).toFixed(9), // Convert Wei to Gwei
//         tx.hash,
//     ]);

//     const csvContent = [csvHeader, ...csvRows]
//         .map((row) => row.join(","))
//         .join("\n");

//     fs.writeFileSync(outputFile, csvContent, "utf8");
//     console.log(`Transaction history exported successfully to ${outputFile}`);
// }