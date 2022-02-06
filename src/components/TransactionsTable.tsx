import { Chip, Typography } from "@mui/material";
import styles from "@/styles/components/TransactionsTable.module.css";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import { Transaction } from "@/types/transaction";
import { Box } from "@mui/system";
import Link from "@mui/material/Link";
import Image from "next/image";

interface Column {
  id: "time" | "transaction_id" | "sender" | "receiver" | "bonder" | "status";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "time", label: "Time", minWidth: 170 },
  { id: "transaction_id", label: "Transaction ID", minWidth: 100 },
  {
    id: "sender",
    label: "Sender",
    minWidth: 170,
    align: "right",
  },
  {
    id: "receiver",
    label: "Receiver",
    minWidth: 170,
    align: "right",
  },
  {
    id: "bonder",
    label: "Bonder",
    minWidth: 170,
    align: "right",
  },
  {
    id: "status",
    label: "Status",
    minWidth: 170,
    align: "right",
  },
];

interface Data {
  time: string;
  transaction_id: string;
  receiver: string;
  sender: string;
  bonder: string;
  status: string;
}

function createData(
  time: string,
  transaction_id: string,
  receiver: string,
  sender: string,
  bonder: string,
  status: string
): Data {
  return { time, transaction_id, receiver, sender, bonder, status };
}

const TransactionsTable = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getDestinationTransactionUrl = (transaction: Transaction) => {
    if (transaction.sourceChain === 1) {
      return transaction.sourceTxExplorerUrl;
    }

    if (transaction.bonded) {
      return transaction.bondTxExplorerUrl;
    }

    return transaction.sourceTxExplorerUrl;
  };

  return (
    <div className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Latest Transactions
      </Typography>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 540 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={"left"}
                    style={{ minWidth: column.minWidth }}
                    className={styles.tableHeadCell}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className={styles.tableBody}>
              {transactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => {
                  console.log(transaction);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={transaction.transferId}
                    >
                      <TableCell align="left" className={styles.timeCell}>
                        {transaction.relativeTimestamp}
                      </TableCell>

                      <TableCell align="left">
                        <Box className={styles.transactionIdCell}>
                          <ContentCopyRoundedIcon fontSize="small" />
                          <Link
                            href={transaction.sourceTxExplorerUrl}
                            target="_blank"
                            underline="none"
                          >
                            <Typography variant="body2">
                              {transaction.transferIdTruncated}
                            </Typography>
                          </Link>
                        </Box>
                      </TableCell>

                      {/** Sender Cell */}
                      <TableCell align="left">
                        <Box className={styles.transactionIdCell}>
                          <ContentCopyRoundedIcon fontSize="small" />
                          <Link
                            href={transaction.sourceTxExplorerUrl}
                            target="_blank"
                            underline="none"
                          >
                            <Typography variant="body2">
                              {transaction.transactionHashTruncated}
                            </Typography>
                          </Link>
                        </Box>
                        <Box className={styles.chainName}>
                          <Image
                            src={transaction.sourceChainImageUrl}
                            alt={`${transaction.sourceChainName} image`}
                            height={16}
                            width={16}
                          />
                          <Typography variant="body2">
                            {transaction.sourceChainName}
                          </Typography>
                        </Box>
                        <Box className={styles.amount}>
                          <Image
                            src={transaction.tokenImageUrl}
                            alt={`${transaction.token} image`}
                            height={16}
                            width={16}
                          />
                          <Typography variant="body2">
                            {`${transaction.displayAmount} ${transaction.token}`}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/** Receiver Cell */}
                      <TableCell align="left">
                        <Box className={styles.transactionIdCell}>
                          <ContentCopyRoundedIcon fontSize="small" />
                          <Link
                            href={getDestinationTransactionUrl(transaction)}
                            target="_blank"
                            underline="none"
                          >
                            <Typography variant="body2">
                              {transaction.bondTransactionHashTruncated.length >
                              0
                                ? transaction.bondTransactionHashTruncated
                                : transaction.transactionHashTruncated}
                            </Typography>
                          </Link>
                        </Box>
                        <Box className={styles.chainName}>
                          <Image
                            src={transaction.destinationChainImageUrl}
                            alt={`${transaction.destinationChainName} image`}
                            height={16}
                            width={16}
                          />
                          <Typography variant="body2">
                            {transaction.destinationChainName}
                          </Typography>
                        </Box>
                        <Box className={styles.amount}>
                          <Image
                            src={transaction.tokenImageUrl}
                            alt={`${transaction.token} image`}
                            height={16}
                            width={16}
                          />
                          <Typography variant="body2">
                            {`${transaction.displayAmount} ${transaction.token}`}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/** Bonder Cell */}
                      <TableCell align="left">
                        {transaction.sourceChain === 1 ||
                        !transaction.bonded ? (
                          <Typography variant="body2">N/A</Typography>
                        ) : (
                          <>
                            <Box className={styles.transactionIdCell}>
                              <ContentCopyRoundedIcon fontSize="small" />
                              <Link
                                href={transaction.bondTxExplorerUrl}
                                target="_blank"
                                underline="none"
                              >
                                <Typography variant="body2">
                                  {transaction.bonderTruncated}
                                </Typography>
                              </Link>
                            </Box>
                            <Box className={styles.amount}>
                              <Typography variant="body2">Fee:</Typography>
                              <Image
                                src={transaction.tokenImageUrl}
                                alt={`${transaction.token} image`}
                                height={16}
                                width={16}
                              />
                              <Typography variant="body2">
                                {`${transaction.displayBonderFee} ${transaction.token}`}
                              </Typography>
                            </Box>
                          </>
                        )}
                      </TableCell>

                      {/** Bonder Cell */}
                      <TableCell align="left">
                        {transaction.bonded ? (
                          <Chip label="Bonded" color="success" />
                        ) : (
                          <Chip label="Pending" color="warning" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          className={styles.tablePagination}
        />
      </Paper>
    </div>
  );
};

export default TransactionsTable;
