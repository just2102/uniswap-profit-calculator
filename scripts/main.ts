import { Address } from "viem"
import Moralis from "moralis"

import {
  getAlchemyTransactions,
  getTransactionsMoralis,
} from "./getTransactions"
import {
  filterTransactionsAlchemy,
  filterTransactionsMoralis,
} from "./filterTransactions"

import * as dotenv from "dotenv"
import { SupportedChains } from "../data/types"
import { AlchemyChainDictionary } from "../data/const"
dotenv.config()

async function calculateProfit(
  address: Address,
  chain: SupportedChains,
  ignoreProfitAbove: number,
  numOfDays: number,
) {
  const providerToUse = AlchemyChainDictionary[chain] ? "alchemy" : "moralis"

  const result = {
    totalValueUsd: 0,
    tokenToAmountMap: new Map<string, number>(),
  }

  if (providerToUse === "alchemy") {
    const transactions = await getAlchemyTransactions({
      address,
      chain,
      numOfDays,
    })
    const { totalValueUsd, tokenToAmountMap } = await filterTransactionsAlchemy(
      {
        transactions,
        chain,
        ignoreProfitAbove,
      },
    )
    result.totalValueUsd = totalValueUsd
    result.tokenToAmountMap = tokenToAmountMap
  } else {
    const transactions = await getTransactionsMoralis({
      address,
      chain,
      numOfDays,
    })
    const { totalValueUsd, tokenToAmountMap } = await filterTransactionsMoralis(
      {
        transactions,
        chain,
        ignoreProfitAbove,
      },
    )
    result.totalValueUsd = totalValueUsd
    result.tokenToAmountMap = tokenToAmountMap
  }

  console.log("Success!")
  console.log("Total value in USD: ", result.totalValueUsd)
  console.log("Total earnings by token: ", result.tokenToAmountMap)
}

export default calculateProfit
