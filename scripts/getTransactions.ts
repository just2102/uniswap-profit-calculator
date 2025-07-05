import { Address, numberToHex, toHex } from "viem"
import { SupportedChains, TransactionMoralis } from "../data/types"
import {
  BlockTimes,
  getAlchemyChain,
  getChain,
  getUniswapPoolNftContract,
  SECONDS_PER_DAY,
} from "../data/const"
import Moralis from "moralis"
import { Alchemy, AssetTransfersCategory, SortingOrder } from "alchemy-sdk"

export async function getTransactionsMoralis({
  address,
  chain,
  numOfDays,
}: {
  address: Address
  chain: SupportedChains
  numOfDays: number
}) {
  if (!process.env.MORALIS_KEY) throw new Error("Moralis key not found")
  await Moralis.start({
    apiKey: process.env.MORALIS_KEY,
  })

  const transactions = await Moralis.EvmApi.wallets
    .getWalletHistory({
      chain: toHex(getChain(chain).id),
      order: "ASC",
      address: address,
      fromDate: new Date(Date.now() - numOfDays * 24 * 60 * 60 * 1000),
    })
    .then((res) => res.response.toJSON().result)

  return transactions as TransactionMoralis[]
}

export async function getAlchemyTransactions({
  chain,
  address,
  numOfDays,
}: {
  chain: SupportedChains
  address: Address
  numOfDays: number
}) {
  const apiKey = process.env.ALCHEMY_KEY
  if (!apiKey) throw new Error("Alchemy API key not found")
  const alchemy = new Alchemy({ apiKey, network: getAlchemyChain(chain) })

  const blockTimeSeconds = BlockTimes[chain]
  const totalSeconds = numOfDays * SECONDS_PER_DAY

  const currentBlock = await alchemy.core.getBlockNumber()
  const blocksMined = Math.floor(totalSeconds / blockTimeSeconds)
  const fromBlock = currentBlock - blocksMined

  const transactions = await alchemy.core.getAssetTransfers({
    fromAddress: getUniswapPoolNftContract(chain),
    toAddress: address,
    category: [AssetTransfersCategory.ERC20], // alchemy currently does not support internal transfers for Unichain
    order: SortingOrder.DESCENDING,
    fromBlock: numberToHex(fromBlock),
  })

  return transactions.transfers
}
