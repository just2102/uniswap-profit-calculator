import { Address } from "viem"
import Moralis from "moralis"

import getTransactions from "./getTransactions"
import filterTransactions from "./filterTransactions"

import * as fs from "fs"

import * as dotenv from "dotenv"
import { SupportedChains } from "../data/types"
dotenv.config()

async function calculateProfit(
  address: Address,
  chain: SupportedChains,
  ignoreProfitAbove: number,
) {
  if (!process.env.MORALIS_KEY) throw new Error("Moralis key not found")

  await Moralis.start({
    apiKey: process.env.MORALIS_KEY,
  })

  const txs = await getTransactions(address, chain)

  const { filteredTxs, totalValueUsd, tokenToAmountMap } =
    await filterTransactions(txs, chain, ignoreProfitAbove)

  fs.writeFileSync("filtered_txs.json", JSON.stringify(filteredTxs, null, 2))

  console.log("Success!")
  console.log("Total value in USD: ", totalValueUsd)

  console.log("Total earnings by token: ", tokenToAmountMap)
  return filteredTxs
}

export default calculateProfit
