import { Typography } from "@mui/material";
import styles from "@/styles/components/TransactionsTable.module.css";
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';


interface Column {
    id: 'time' | 'transaction_id' | 'sender' | 'receiver' | 'bonder' | 'status'  ;
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
  }
  
  const columns: readonly Column[] = [
    { id: 'time', label: 'Time', minWidth: 170 },
    { id: 'transaction_id', label: 'Transaction ID', minWidth: 100 },
    {
      id: 'sender',
      label: 'Sender',
      minWidth: 170,
      align: 'right',
    },
    {
      id: 'receiver',
      label: 'Receiver',
      minWidth: 170,
      align: 'right',
    },
    {
      id: 'bonder',
      label: 'Bonder',
      minWidth: 170,
      align: 'right',
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 170,
      align: 'right',
    },
  ];
  
  interface Data {
    time: string;
    transaction_id: string;
    receiver: string;
    sender: string;
    bonder: string;
    status: string
  }
  
  function createData(
    time: string,
    transaction_id: string,
    receiver: string,
    sender: string,
    bonder: string,
    status: string
  ): Data {
    return { time,transaction_id, receiver, sender, bonder, status };
  }
  
  const rows = [
    createData('2s ago', '0xdec6...9a21a7', "0xb3c2...6c81d7", "0xdec6...9a21a7", "0xdec6...9a21a7", "bonded"),
    createData('2s ago', '0xdec6...9a21a7', "0xb3c2...6c81d7", "0xdec6...9a21a7", "0xdec6...9a21a7", "bonded"),
    createData('2s ago', '0xdec6...9a21a7', "0xb3c2...6c81d7", "0xdec6...9a21a7", "0xdec6...9a21a7", "bonded"),
    createData('2s ago', '0xdec6...9a21a7', "0xb3c2...6c81d7", "0xdec6...9a21a7", "0xdec6...9a21a7", "bonded"),
  ];
  

const TransactionsTable = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

  return (
    <div className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Latest Transactions
      </Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  className={styles.tableHeadCell}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className={styles.tableBody}>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.transaction_id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
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
