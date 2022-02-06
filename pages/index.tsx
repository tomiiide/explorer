import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/pages/Index.module.css";
import Nav from "@/components/Nav";
import TransactionsTable from "@/components/TransactionsTable";
import { fetchAllChainTransactions } from "@/services/transactions";
import { useEffect, useState } from "react";
import { Transaction } from "@/types/transaction";

const Home: NextPage = () => {

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect( () => {

    async function fetchData() {
      const data = await fetchAllChainTransactions() as Transaction[];
      setTransactions(data);
    }

    fetchData()
  }, []);

  return (
    <div>
      <Head>
        <title>Hop Explorer</title>
        <meta name="description" content="Hop protocol explorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={` ${styles.main} ${styles.circles_bg}`}>
        <Nav />
        <TransactionsTable transactions={transactions} />
      </main>
    </div>
  );
};

export default Home;
