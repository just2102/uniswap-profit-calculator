import Moralis from "moralis"
import {
  getAlchemyChain,
  getChain,
  getUniswapPoolNftContract,
  getWETHAddress,
} from "../data/const"
import asyncFilter from "../utils/asyncFilter"
import { SupportedChains, TransactionMoralis } from "../data/types"
import { toHex } from "viem"
import { Alchemy, AssetTransfersResult } from "alchemy-sdk"
const fs = require("fs")

export async function filterTransactionsMoralis({
  transactions,
  chain,
  ignoreProfitAbove,
}: {
  transactions: TransactionMoralis[]
  chain: SupportedChains
  ignoreProfitAbove: number
}) {
  const uniswapPoolNftContract = getUniswapPoolNftContract(chain)

  let totalValueUsd = 0
  const tokenToAmountMap = new Map<string, number>()

  const filteredTxs = await asyncFilter(transactions, async (tx) => {
    const conditions =
      tx.category !== "token swap" &&
      tx.erc20_transfers.length > 0 &&
      tx.native_transfers.length > 0 &&
      (tx.native_transfers.find((nativeTransfer) => {
        return nativeTransfer.from_address === uniswapPoolNftContract
      }) ||
        tx.erc20_transfers.find((erc20Transfer) => {
          return erc20Transfer.from_address === uniswapPoolNftContract
        }))

    if (!conditions) return false

    const priceInNative = await Moralis.EvmApi.token
      .getTokenPrice({
        chain: toHex(getChain(chain).id),
        address: getWETHAddress(chain),
      })
      .then((res) => res.toJSON())
    if (!priceInNative.usdPriceFormatted)
      throw "Unexpected: No usd price formatted"

    const priceInUsdErc20 = await Moralis.EvmApi.token
      .getTokenPrice({
        chain: toHex(getChain(chain).id),
        address: tx.erc20_transfers[0].address,
      })
      .then((res) => res.toJSON())

    if (!priceInUsdErc20.usdPriceFormatted)
      throw "Unexpected: No usd price formatted"

    const txValueUsd1 =
      parseFloat(priceInUsdErc20.usdPriceFormatted) *
      parseFloat(tx.erc20_transfers[0].value_formatted)

    const txValueUsd2 =
      tx.native_transfers[0] !== undefined
        ? parseFloat(priceInNative.usdPriceFormatted) *
          parseFloat(tx.native_transfers[0].value_formatted)
        : 0

    if (txValueUsd1 + txValueUsd2 < ignoreProfitAbove) {
      totalValueUsd += txValueUsd1 + txValueUsd2

      tokenToAmountMap.set(
        tx.erc20_transfers[0].token_symbol,
        (tokenToAmountMap.get(tx.erc20_transfers[0].token_symbol) || 0) +
          parseFloat(tx.erc20_transfers[0].value_formatted),
      )
      tokenToAmountMap.set(
        tx.native_transfers[0].token_symbol,
        (tokenToAmountMap.get(tx.native_transfers[0].token_symbol) || 0) +
          parseFloat(tx.native_transfers[0].value_formatted),
      )

      return true
    }

    return false
  })

  return {
    filteredTxs,
    totalValueUsd,
    tokenToAmountMap,
  }
}

export async function filterTransactionsAlchemy({
  transactions,
  chain,
  ignoreProfitAbove,
}: {
  transactions: AssetTransfersResult[]
  chain: SupportedChains
  ignoreProfitAbove: number
}) {
  const tokenPrices = new Map<string, number>()
  const network = getAlchemyChain(chain)
  const alchemy = new Alchemy({
    apiKey: process.env.ALCHEMY_KEY,
    network,
  })

  const filteredByValue = transactions.filter((tx) => {
    return tx.value && tx.value < ignoreProfitAbove
  })

  const result = {
    totalValueUsd: 0,
    tokenToAmountMap: new Map<string, number>(),
  }

  for (const tx of filteredByValue) {
    if (!tx.value) continue
    if (!tx.rawContract.address) continue
    if (!tx.asset) continue

    const tokenPriceUsd =
      tokenPrices.get(tx.rawContract.address) ||
      (
        await alchemy.prices.getTokenPriceByAddress([
          {
            network,
            address: tx.rawContract.address,
          },
        ])
      ).data[0].prices[0].value
    tokenPrices.set(tx.rawContract.address, Number(tokenPriceUsd))

    result.totalValueUsd += tx.value * Number(tokenPriceUsd)
    result.tokenToAmountMap.set(
      tx.asset,
      (result.tokenToAmountMap.get(tx.asset) || 0) + tx.value,
    )
  }

  return result
}
