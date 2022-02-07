import { DateTime } from "luxon";
import { ethers } from "ethers";

const enabledTokens = ["USDC", "USDT", "DAI", "MATIC", "ETH", "WBTC"];
const enabledChains = ["ethereum", "polygon", "arbitrum", "optimism", "gnosis"];

const endpoints = {
  ethereum: "https://api.thegraph.com/subgraphs/name/hop-protocol/hop-mainnet",
  gnosis: "https://api.thegraph.com/subgraphs/name/hop-protocol/hop-xdai",
  polygon: "https://api.thegraph.com/subgraphs/name/hop-protocol/hop-polygon",
  arbitrum: "https://api.thegraph.com/subgraphs/name/hop-protocol/hop-arbitrum",
  optimism: "https://api.thegraph.com/subgraphs/name/hop-protocol/hop-optimism",
};

function getUrl(chain) {
  return endpoints[chain];
}

async function queryFetch(url, query, variables) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: variables || {},
    }),
  });
  const jsonRes = await res.json();
  if (jsonRes.errors) {
    throw new Error(jsonRes.errors[0].message);
  }
  return jsonRes.data;
}

const getChainId = (chain: string) => {
  const chainIDs: { [char: string]: number } = {
    ethereum: 1,
    gnosis: 100,
    polygon: 137,
    arbitrum: 42161,
    optimism: 10,
  };

  return chainIDs[chain] as number;
};

const chainIdToSlugMap: any = {
  1: "ethereum",
  42: "ethereum",
  10: "optimism",
  69: "optimism",
  77: "gnosis",
  100: "gnosis",
  137: "polygon",
  42161: "arbitrum",
  421611: "arbitrum",
};

const chainSlugToNameMap = {
  ethereum: "Ethereum",
  gnosis: "Gnosis",
  polygon: "Polygon",
  arbitrum: "Arbitrum",
  optimism: "Optimism",
};

const colorsMap = {
  ethereum: "#868dac",
  gnosis: "#46a4a1",
  polygon: "#8b57e1",
  optimism: "#e64b5d",
  arbitrum: "#289fef",
  fallback: "#9f9fa3",
};

const chainLogosMap = {
  ethereum:
    "https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/ethereum.svg",
  gnosis:
    "https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/gnosis.svg",
  polygon:
    "https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/polygon.svg",
  optimism:
    "https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/optimism.svg",
  arbitrum:
    "https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/arbitrum.svg",
};

const tokenLogosMap = {
  USDC: "https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/usdc.svg",
  USDT: "https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/usdt.svg",
  DAI: "https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/dai.svg",
  MATIC:
    "https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/matic.svg",
  ETH: "https://s3.us-west-1.amazonaws.com/assets.hop.exchange/logos/ethereum.svg",
};

const tokenDecimals = {
  USDC: 6,
  USDT: 6,
  DAI: 18,
  MATIC: 18,
  ETH: 18,
};

function explorerLink(chain) {
  let base = "";
  if (chain === "gnosis") {
    base = "https://blockscout.com/xdai/mainnet";
  } else if (chain === "polygon") {
    base = "https://polygonscan.com";
  } else if (chain === "optimism") {
    base = "https://optimistic.etherscan.io";
  } else if (chain === "arbitrum") {
    base = "https://arbiscan.io";
  } else {
    base = "https://etherscan.io";
  }

  return base;
}

function explorerLinkAddress(chain, address) {
  const base = explorerLink(chain);
  return `${base}/address/${address}`;
}

function explorerLinkTx(chain, transactionHash) {
  const base = explorerLink(chain);
  return `${base}/tx/${transactionHash}`;
}

export async function fetchTransfers(
  chain: string,
  startTime: number,
  endTime: number,
  skip: number = 1000,
  transferId?: string,
  account?: string
) {
  console.log(transferId)
  console.log(account)
  const perPage = 1000;
  const queryL1 = `
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
  const queryL2 = `
    query TransferSents($perPage: Int, $startTime: Int, $endTime: Int, $skip: Int, $transferId: String, $account: String) {
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
  const url = getUrl(chain);
  const payload = await queryFetch(url, query, {
    perPage,
    startTime,
    endTime,
    skip,
    transferId,
    account,
  });

  

  let transfers = (
    payload
      ? payload.transferSents.concat(payload.transferSents2)
      : []
  ).filter((x: any) => x);

  if (transfers.length === perPage) {
    try {
      transfers = transfers.concat(
        ...(await fetchTransfers(chain, startTime, endTime, skip + perPage))
      );
    } catch (err: any) {
      if (!err.message.includes("The `skip` argument must be between")) {
        throw err;
      }
    }
  }

  let data = transfers.map((transfer: any) => ({
    sourceChain: getChainId(chain),
    destinationChain: transfer.destinationChainId,
    amount: transfer.amount,
    bonderFee:
      getChainId(chain) === getChainId("ethereum")
        ? transfer.relayerFee
        : transfer.bonderFee,
    transferId:
      getChainId(chain) === getChainId("ethereum")
        ? transfer.id
        : transfer.transferId,
    transactionHash: transfer.transactionHash,
    timestamp: Number(transfer.timestamp),
    token: transfer.token,
    bonded: getChainId(chain) === getChainId("ethereum"),
  }));

  data.sort((a: any, b: any) => b.timestamp - a.timestamp);
  return data;
}

export async function fetchBonds(
  chain: string,
  startTime: number,
  endTime: number,
  lastId: string | undefined,
  transferId: string | string[]
) {
  const query = `
    query WithdrawalBondeds($startTime: Int, $endTime: Int, $lastId: ID, $transferId: String, $transferIds: [String]) {
      withdrawalBondeds1: withdrawalBondeds(
        where: {
          ${
            Array.isArray(transferId)
              ? "transferId_in: $transferIds"
              : transferId
              ? "transferId: $transferId"
              : "timestamp_gte: $startTime, timestamp_lte: $endTime"
          },
          id_gt: $lastId
        },
        first: 1000,
        orderBy: id,
        orderDirection: asc
      ) {
        id
        transferId
        transactionHash
        timestamp
        token
        from
      }${
        typeof transferId === "string"
          ? `
      , withdrawalBondeds2: withdrawalBondeds(
        where: {
          transactionHash: $transferId
        },
        first: 1000,
        orderBy: id,
        orderDirection: asc,
      ) {
        id
        transferId
        transactionHash
        timestamp
        token
        from
      }`
          : ""
      }
    }
  `;

  const url = getUrl(chain);
  const payload = await queryFetch(url, query, {
    endTime,
    startTime,
    lastId: lastId || "0x0000000000000000000000000000000000000000",
    transferId: !Array.isArray(transferId) ? transferId : undefined,
    transferIds: Array.isArray(transferId) ? transferId : [],
  });

  

  let bonds = (payload.withdrawalBondeds1 || []).concat(
    payload.withdrawalBondeds2 || []
  );

  if (bonds.length === 1000) {
    try {
      const newLastId = bonds[bonds.length - 1].id;
      if (lastId === newLastId) {
        return bonds;
      }
      lastId = newLastId;
      bonds = bonds.concat(
        ...(await fetchBonds(chain, startTime, endTime, lastId, transferId))
      );
    } catch (err: any) {
      if (!err.message.includes("The `skip` argument must be between")) {
        throw err;
      }
    }
  }

  return bonds;
}

export async function fetchWithdrawals(
  chain: string,
  startTime: number,
  endTime: number,
  skip: number = 0,
  transferId?: string
) {
  const query = `
    query Withdrews($perPage: Int, $startTime: Int, $endTime: Int, $transferId: String){
      withdrews(
        where: {
          ${
            transferId
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
        transactionHash
        timestamp
        token
      }
    }
  `;

  const url = getUrl(chain);
  const payload = await queryFetch(url, query, {
    perPage: 1000,
    startTime,
    endTime,
    transferId,
    skip,
  });

  
  let withdrawals = payload.withdrews || [];

  if (withdrawals.length === 1000) {
    try {
      withdrawals = withdrawals.concat(
        ...(await fetchWithdrawals(
          chain,
          startTime,
          endTime,
          skip + 1000,
          transferId
        ))
      );
    } catch (err: any) {
      if (!err.message.includes("The `skip` argument must be between")) {
        throw err;
      }
    }
  }
  return withdrawals;
}

export async function fetchAllChainTransactions(
  account: string = "",
  transferId: string = ""
) {
  console.log(account, transferId);
  const currentDate = DateTime.now().toFormat("yyyy-MM-dd");
  const endDate = DateTime.fromFormat(currentDate, "yyyy-MM-dd")
    .endOf("day")
    .toUTC();
  let startTime = Math.floor(
    endDate.minus({ days: 1 }).startOf("day").toSeconds()
  );
  let endTime = Math.floor(endDate.toSeconds());

  // fetch  all transfers
  const transfers = await Promise.all(
    enabledChains.map((chain) =>
      fetchTransfers(chain, startTime, endTime, 0, transferId, account)
    )
  );
  const allTransfers = transfers.reduce((acc, cur) => acc.concat(cur), []);

  console.log(allTransfers)

  startTime = allTransfers.length
    ? allTransfers[allTransfers.length - 1].timestamp
    : 0;
  endTime = allTransfers.length ? allTransfers[0].timestamp : 0;

  if (startTime) {
    startTime = Math.floor(
      DateTime.fromSeconds(startTime).minus({ days: 1 }).toSeconds()
    );
  }

  if (endTime) {
    endTime = Math.floor(
      DateTime.fromSeconds(endTime).plus({ days: 1 }).toSeconds()
    );
  }

  const filterTransferIds =
    account.length > 0
      ? allTransfers.map((transfer: any) => transfer.transferId)
      : transferId;
  
  // fetch all bonds and withdrawals
  const [
    gnosisBondedWithdrawals,
    polygonBondedWithdrawals,
    optimismBondedWithdrawals,
    arbitrumBondedWithdrawals,
    mainnetBondedWithdrawals,

    gnosisWithdrews,
    polygonWithdrews,
    optimismWithdrews,
    arbitrumWithdrews,
    mainnetWithdrews,
  ] = await Promise.all([
    enabledChains.includes("gnosis")
      ? fetchBonds("gnosis", startTime, endTime, undefined, filterTransferIds)
      : Promise.resolve([]),
    enabledChains.includes("polygon")
      ? fetchBonds("polygon", startTime, endTime, undefined, filterTransferIds)
      : Promise.resolve([]),
    enabledChains.includes("optimism")
      ? fetchBonds("optimism", startTime, endTime, undefined, filterTransferIds)
      : Promise.resolve([]),
    enabledChains.includes("arbitrum")
      ? fetchBonds("arbitrum", startTime, endTime, undefined, filterTransferIds)
      : Promise.resolve([]),
    enabledChains.includes("ethereum")
      ? fetchBonds("ethereum", startTime, endTime, undefined, filterTransferIds)
      : Promise.resolve([]),

    enabledChains.includes("gnosis")
      ? fetchWithdrawals("gnosis", startTime, endTime, undefined, transferId)
      : Promise.resolve([]),
    enabledChains.includes("polygon")
      ? fetchWithdrawals("polygon", startTime, endTime, undefined, transferId)
      : Promise.resolve([]),
    enabledChains.includes("optimism")
      ? fetchWithdrawals("optimism", startTime, endTime, undefined, transferId)
      : Promise.resolve([]),
    enabledChains.includes("arbitrum")
      ? fetchWithdrawals("arbitrum", startTime, endTime, undefined, transferId)
      : Promise.resolve([]),
    enabledChains.includes("ethereum")
      ? fetchWithdrawals("ethereum", startTime, endTime, undefined, transferId)
      : Promise.resolve([]),
  ]);
  const gnosisBonds = [...gnosisBondedWithdrawals, ...gnosisWithdrews];
  const polygonBonds = [...polygonBondedWithdrawals, ...polygonWithdrews];
  const optimismBonds = [...optimismBondedWithdrawals, ...optimismWithdrews];
  const arbitrumBonds = [...arbitrumBondedWithdrawals, ...arbitrumWithdrews];
  const mainnetBonds = [...mainnetBondedWithdrawals, ...mainnetWithdrews];
  // merge all transfers and bonds

  const bondsMap: any = {
    gnosis: gnosisBonds,
    polygon: polygonBonds,
    optimism: optimismBonds,
    arbitrum: arbitrumBonds,
    ethereum: mainnetBonds,
  };

  for (const x of allTransfers) {
    const bonds = bondsMap[chainIdToSlugMap[x.destinationChain]];
    if (bonds) {
      for (const bond of bonds) {
        if (bond.transferId === x.transferId) {
          x.bonded = true;
          x.bonder = bond.from;
          x.bondTransactionHash = bond.transactionHash || "";
          x.bondedTimestamp = Number(bond.timestamp);
          continue;
        }
      }
    }
  }

  const unbondableTransfers = [
    "0xf78b17ccced6891638989a308cc6c1f089330cd407d8c165ed1fbedb6bda0930",
    "0x5a37e070c256e37504116e351ec3955679539d6aa3bd30073942b17afb3279f4",
    "0x185b2ba8f589119ede69cf03b74ee2b323b23c75b6b9f083bdf6123977576790",
    "0x0131496b64dbd1f7821ae9f7d78f28f9a78ff23cd85e8851b8a2e4e49688f648",
  ];

  const refinedData = allTransfers
    .filter((x) => enabledTokens.includes(x.token))
    .filter((x) => x.destinationChain && x.transferId)
    .filter((x) => {
      return !unbondableTransfers.includes(x.transferId);
    })
    .map(populateTransfer)
    .filter(
      (x) =>
        enabledChains.includes(x.sourceChainSlug) &&
        enabledChains.includes(x.destinationChainSlug)
    )
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((x, i) => {
      x.index = i;
      return x;
    });
    
  return refinedData;
}

function populateTransfer(x, i) {
  x.transactionHashTruncated = truncateHash(x.transactionHash);

  const transferTime = DateTime.fromSeconds(x.timestamp);
  x.transferIdTruncated = truncateHash(x.transferId);
  x.isoTimestamp = transferTime.toISO();
  x.relativeTimestamp = transferTime.toRelative();

  x.sourceChainSlug = chainIdToSlugMap[x.sourceChain];
  x.destinationChainSlug = chainIdToSlugMap[x.destinationChain];

  x.sourceChainName = chainSlugToNameMap[x.sourceChainSlug];
  x.destinationChainName = chainSlugToNameMap[x.destinationChainSlug];

  x.sourceChainImageUrl = chainLogosMap[x.sourceChainSlug];
  x.destinationChainImageUrl = chainLogosMap[x.destinationChainSlug];

  x.sourceTxExplorerUrl = explorerLinkTx(x.sourceChainSlug, x.transactionHash);
  x.bondTxExplorerUrl = x.bondTransactionHash
    ? explorerLinkTx(x.destinationChainSlug, x.bondTransactionHash)
    : "";
  x.bonderTruncated = truncateAddress(x.bonder);
  x.bonderUrl = x.bonder
    ? explorerLinkAddress(x.destinationChainSlug, x.bonder)
    : "";
  x.bondTransactionHashTruncated = x.bondTransactionHash
    ? truncateHash(x.bondTransactionHash)
    : "";

  if (x.bondedTimestamp) {
    const bondedTime = DateTime.fromSeconds(x.bondedTimestamp);
    x.isoBondedTimestamp = bondedTime.toISO();
    x.relativeBondedTimestamp = bondedTime.toRelative();
    const diff = bondedTime
      .diff(transferTime, ["days", "hours", "minutes"])
      .toObject();
    let hours = Number(diff.hours.toFixed(0));
    let minutes = Number(diff.minutes.toFixed(0));
    if (hours < 0) {
      hours = 0;
    }
    if (minutes < 1) {
      minutes = 1;
    }
    if (hours || minutes) {
      x.relativeBondedWithinTimestamp = `${
        hours ? `${hours} hour${hours > 1 ? "s" : ""} ` : ""
      }${minutes ? `${minutes} minute${minutes > 1 ? "s" : ""}` : ""}`;
    }
  }

  const decimals = tokenDecimals[x.token];
  x.formattedAmount = Number(ethers.utils.formatUnits(x.amount, decimals));
  x.displayAmount = formatCurrency(
    ethers.utils.formatUnits(x.amount, decimals),
    x.token
  );

  x.displayBonderFee = formatCurrency(
    ethers.utils.formatUnits(x.bonderFee, decimals),
    x.token
  );
  x.tokenImageUrl = tokenLogosMap[x.token];

  return x;
}

function truncateAddress(address) {
  return truncateString(address, 4);
}

function truncateHash(hash) {
  return truncateString(hash, 6);
}

function truncateString(str, splitNum) {
  if (!str) return "";
  return (
    str.substring(0, 2 + splitNum) +
    "…" +
    str.substring(str.length - splitNum, str.length)
  );
}

function formatCurrency(value, token) {
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    // style: 'currency',
    // currency: 'USD'
  });

  if (token === "MATIC" || token === "ETH") {
    return Number(value || 0).toFixed(5);
  }

  return `$${currencyFormatter.format(value)}`;
}
