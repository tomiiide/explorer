import type { NextPage } from "next";
import { useRouter } from 'next/router'
import Head from "next/head";
import styles from "@/styles/pages/Index.module.css";
import Nav from "@/components/Nav";
import TransactionsTable from "@/components/TransactionsTable";
import { fetchAllChainTransactions } from "@/services/transactions";
import { useEffect, useState } from "react";
import { Transaction } from "@/types/transaction";

const Home: NextPage = () => {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAccount, setFilterAccount] = useState("")
  const [filterId, setFilterId] = useState("")

  const handleSearchUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSearch(value);
    if (/^0x([A-Fa-f0-9]{64})$/.test(value)) {
      router.push(`/transaction/${value.toLowerCase()}`)
    }
    if (/^0x([A-Fa-f0-9]{40})$/.test(value)) {
      router.push(`/account/${value.toLowerCase()}`)
      return
    }
    setFilterAccount("");
    setFilterId("");
    return;
  }

  useEffect( () => {
    async function fetchData() {
      setLoading(true);
      const data = await fetchAllChainTransactions(filterAccount, filterId) as Transaction[];
      setTransactions(data);
      setLoading(false);
    }

    fetchData()
  }, [filterAccount, filterId]);

  return (
    <div>
      <Head>
        <title>Hop Explorer</title>
        <meta name="description" content="Hop protocol explorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={` ${styles.main} ${styles.circles_bg}`}>
        <Nav handleSearch={handleSearchUpdate} currentSearch={search} />
        <TransactionsTable transactions={transactions} loading={loading} />
      </main>
    </div>
  );
};

export default Home;
