import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from "../styles/Home.module.css";
import { DateTime } from "luxon";
import { useQuery, gql } from "@apollo/client";

const transferId = "";
const account = "";

const queryL1 = gql`
    query TransferSentToL2($perPage: Int, $startTime: Int, $endTime: Int, $skip: Int, $transferId: String, $account: String) {
      transferSents: transferSentToL2S(
      ${
        account
          ? `
        where: {
          from: $account
        },
        first: $perPage,
        orderBy: timestamp,
        orderDirection: desc
      `
          : transferId
          ? `
        where: {
          transactionHash: $transferId
        },
        first: $perPage,
        orderBy: timestamp,
        orderDirection: desc
      `
          : `
        where: {
          timestamp_gte: $startTime,
          timestamp_lte: $endTime
        },
        first: $perPage,
        orderBy: timestamp,
        orderDirection: desc,
        skip: $skip
        `
      }
      ) {
        id
        destinationChainId
        amount
        relayerFee
        transactionHash
        timestamp
        token
      }
    }
  `;

const Home: NextPage = () => {
  const currentDate = DateTime.now().toFormat("yyyy-MM-dd");

  const endDate = DateTime.fromFormat(currentDate, "yyyy-MM-dd")
    .endOf("day")
    .toUTC();
  let startTime = Math.floor(
    endDate.minus({ days: 1 }).startOf("day").toSeconds()
  );
  let endTime = Math.floor(endDate.toSeconds());

  const { loading, data, error } = useQuery(queryL1, {
    variables: {
      startTime,
      endTime,
    },
  });

  console.log(loading);
  console.log(data);
  console.log(error);

  if (loading) return <div>loading...</div>;

  if (error) return <div> Error: {error}</div>;

  return (
    <div className={styles.container}>
      <Head>
        <title>Hop Explorer</title>
        <meta name="description" content="Hop protocol explorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>{}</main>
    </div>
  );
};

export default Home
