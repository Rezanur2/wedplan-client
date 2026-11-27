export { cn } from "cn"

export function getPaidRevenueSummary(transactionsList: { status?: string; amount?: number }[]) {
  const paidTransactions = transactionsList.filter((transactionItem) => {
    const status = (transactionItem.status || "").toLowerCase();
    return status === "paid" || status === "complete";
  });
  const totalRevenue = paidTransactions.reduce(
    (sum, transactionItem) => sum + Number(transactionItem.amount || 0),
    0
  );
  return { totalRevenue, paidCount: paidTransactions.length };
}
