import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/pages/Index.module.css";
import { DateTime } from "luxon";
import { useQuery, gql } from "@apollo/client";
import Nav from "@/components/Nav";
import TransactionsTable from "@/components/TransactionsTable";
import { fetchAllChainTransactions } from "@/services/transactions";
import { useEffect } from "react";

const Home: NextPage = () => {
  useEffect( () => {

    async function fetchData() {
      const data = await fetchAllChainTransactions();
      console.log(data);
    }

    fetchData()
  }, );

  return (
    <div>
      <Head>
        <title>Hop Explorer</title>
        <meta name="description" content="Hop protocol explorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={` ${styles.main} ${styles.circles_bg}`}>
        <Nav />
        <TransactionsTable />
      </main>
    </div>
  );
};

export default Home;
