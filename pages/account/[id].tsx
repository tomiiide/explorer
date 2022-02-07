import { useRouter } from "next/router";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "@/styles/pages/Index.module.css";
import Nav from "@/components/Nav";
import TransactionsTable from "@/components/TransactionsTable";
import { fetchAllChainTransactions } from "@/services/transactions";
import { useEffect, useState } from "react";
import { Transaction } from "@/types/transaction";
import { isValidAddress, isValidTransactionId } from "@/utils/validation";

const AccountPage: NextPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");

  const router = useRouter();

  const { id } = router.query;

  const handleSearchUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (isValidAddress(value)) {
      setAccount(value.toLowerCase());
      return;
    }
    if (isValidTransactionId(value)) {
      router.push(`/transaction/${value.toLowerCase()}`);
      return;
    }
    router.push("/");
    return;
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (!id) {
      router.push("/");
    }

    if (isValidAddress(id as string)) {
      setAccount((id as string).toLowerCase());
    }

    async function fetchData() {
      setLoading(true);
      const data = (await fetchAllChainTransactions(
        account
      )) as Transaction[];
      setTransactions(data);
      setLoading(false);
    }
    if (account) {
      fetchData();
    }
  }, [account, id, router]);

  return (
    <div>
      <Head>
        <title>Hop Explorer</title>
        <meta name="description" content="Hop protocol explorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={` ${styles.main} ${styles.circles_bg}`}>
        <Nav
          handleSearch={handleSearchUpdate}
          currentSearch={(id as string) || ""}
        />
        <TransactionsTable transactions={transactions} loading={loading} />
      </main>
    </div>
  );
};

export default AccountPage;
