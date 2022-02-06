import { Typography } from "@mui/material";
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
import { Transaction } from "@/types/transaction";
import TransactionTableRow from "@/components/TransactionTableRow";
import { useTheme } from '@mui/system';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

const TransactionsTable = ({
  transactions,
  loading,
}: {
  transactions: Transaction[];
  loading: boolean;
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(100);
  const theme = useTheme();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
              {loading && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Skeleton
                      height={100}
                      count={100}
                      baseColor={theme.palette.background.default}
                      highlightColor={ theme.palette.mode === 'dark' ? theme.palette.grey[800] :  theme.palette.grey[400]}
                      duration={1.2}
                    />
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                transactions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((transaction) => {
                    return (
                      <TransactionTableRow
                        key={transaction.transferId}
                        transaction={transaction}
                      />
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100, 200]}
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
