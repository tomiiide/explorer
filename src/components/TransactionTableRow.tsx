import { Chip, Typography } from "@mui/material";
import styles from "@/styles/components/TransactionsTable.module.css";
import * as React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { Transaction } from "@/types/transaction";
import { Box } from "@mui/system";
import Link from "@mui/material/Link";
import Image from "next/image";

const TransactionsTableRow = ({
  transaction,
}: {
  transaction: Transaction;
}) => {
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
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        key={transaction.transferId}
        sx={{ verticalAlign: "top" }}
        className={styles.tableRow}
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
              underline="always"
            >
              <Typography variant="body2">
                {transaction.transferIdTruncated}
              </Typography>
            </Link>
          </Box>
        </TableCell>

        {/** Sender Cell */}
        <TableCell align="left" className={styles.hasCellGap}>
          <Box className={styles.transactionIdCell}>
            <ContentCopyRoundedIcon fontSize="small" />
            <Link
              href={transaction.sourceTxExplorerUrl}
              target="_blank"
              underline="always"
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
        <TableCell align="left" className={styles.hasCellGap}>
          <Box className={styles.transactionIdCell}>
            <ContentCopyRoundedIcon fontSize="small" />
            <Link
              href={getDestinationTransactionUrl(transaction)}
              target="_blank"
              underline="always"
            >
              <Typography variant="body2">
                {transaction.bondTransactionHashTruncated.length > 0
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
        <TableCell align="left" className={styles.hasCellGap}>
          {transaction.sourceChain === 1 || !transaction.bonded ? (
            <Typography variant="body2">N/A</Typography>
          ) : (
            <>
              <Box className={styles.transactionIdCell}>
                <ContentCopyRoundedIcon fontSize="small" />
                <Link
                  href={transaction.bondTxExplorerUrl}
                  target="_blank"
                  underline="always"
                >
                  <Typography variant="body2">
                    {transaction.bonderTruncated}
                  </Typography>
                </Link>
              </Box>
              <Box className={styles.amount}>
                <Typography variant="body2" className={styles.fee}>
                  Fee:
                </Typography>
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

        {/** status Cell */}
        <TableCell align="left">
          {transaction.bonded ? (
            <Chip label="Bonded" color="success" />
          ) : (
            <Chip label="Pending" color="warning" />
          )}
        </TableCell>
      </TableRow>
    
  );
};

export default TransactionsTableRow;
