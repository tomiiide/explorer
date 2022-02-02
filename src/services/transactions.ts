import { ApolloClient, InMemoryCache, gql, ApolloLink } from "@apollo/client";
import { MultiAPILink } from "@habx/apollo-multi-endpoint-link";
import { createHttpLink } from "apollo-link-http";

const enabledChains = ["ethereum", "gnosis", "polygon", "arbitrum", "optimism"];

const endpoints = {
  ethereum: "https://api.thegraph.com/subgraphs/name/hop-protocol/hop-mainnet",
  gnosis: "https://api.thegraph.com/subgraphs/name/hop-protocol/hop-xdai",
  polygon: "https://api.thegraph.com/subgraphs/name/hop-protocol/hop-polygon",
  arbitrum: "https://api.thegraph.com/subgraphs/name/hop-protocol/hop-arbitrum",
  optimism: "https://api.thegraph.com/subgraphs/name/hop-protocol/hop-optimism",
};

const client = new ApolloClient({
  link: ApolloLink.from([
    new MultiAPILink({
      endpoints: { ...endpoints },
      createHttpLink: () => createHttpLink(),
      httpSuffix: "",
    }),
  ]),
  cache: new InMemoryCache(),
});

export async function fetchTransactions(
  chain: string,
  startTime: number,
  endTime: number,
  skip: number = 0,
  transferId?: string,
  account?: string
) {
  const queryL1 = gql`
    query TransferSentToL2($perPage: Int, $startTime: Int, $endTime: Int, $skip: Int, $transferId: String, $account: String) @api(contextKey: "network") {
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
  const queryL2 = gql`
    query TransferSents($perPage: Int, $startTime: Int, $endTime: Int, $skip: Int, $transferId: String, $account: String) @api(contextKey: "network") {
      transferSents(
        where: {
          ${
            account
              ? "from: $account"
              : transferId
              ? "transferId: $transferId"
              : "timestamp_gte: $startTime, timestamp_lte: $endTime"
          }
        },
        first: $perPage,
        orderBy: timestamp,
        orderDirection: desc,
        skip: $skip
      ) {
        id
        transferId
        destinationChainId
        amount
        bonderFee
        transactionHash
        timestamp
        token
      }
      ${
        transferId
          ? `,transferSents2: transferSents(
        where: {
          transactionHash: $transferId
        },
        first: $perPage,
        orderBy: timestamp,
        orderDirection: desc
      ) {
        id
        transferId
        destinationChainId
        amount
        bonderFee
        transactionHash
        timestamp
        token
      }`
          : ""
      }
    }
  `;

  let query = queryL1;
  if (chain !== "ethereum") {
    query = queryL2;
  }
  if (!skip) {
    skip = 0;
  }
  const payload = await client.query({
    query,
    variables: {
      perPage: 1000,
      startTime,
      endTime,
      skip,
      transferId,
      account,
    },
    context: {
      network: chain,
    },
  });

  let transfers = (
    payload ? payload.data.transferSents.concat(payload.data.transferSents2) : []
  ).filter((x: any) => x);

  if (transfers.length === 1000) {
    try {
      transfers = transfers.concat(
        ...(await fetchTransactions(chain, startTime, endTime, skip + 1000))
      );
    } catch (err: any) {
      if (!err.message.includes("The `skip` argument must be between")) {
        throw err;
      }
    }
  }

  return transfers;
}

export async function fetchAllChainTransactions() {
  const startTime = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 365;
  const endTime = Math.floor(Date.now() / 1000);
  const transfers = await Promise.all(
    enabledChains.map((chain) =>
      fetchTransactions(chain, startTime, endTime, 0)
    )
  );
  return transfers.reduce((acc, cur) => acc.concat(cur), []);
}

