import Moralis from "moralis"
import {
  getChain,
  getUniswapPoolNftContract,
  getWETHAddress,
} from "../data/const"
import asyncFilter from "../utils/asyncFilter"
import { SupportedChains, Transaction } from "../data/types"
import { toHex } from "viem"

async function filterTransactions(
  transactions: Transaction[],
  chain: SupportedChains,
  ignoreProfitAbove: number,
) {
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
        (tokenToAmountMap.get(tx.erc20_transfers[0].token_name) || 0) +
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

export default filterTransactions
