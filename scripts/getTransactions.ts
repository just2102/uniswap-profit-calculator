import { Address, toHex } from "viem"
import { SupportedChains, Transaction } from "../data/types"
import { getChain } from "../data/const"
import Moralis from "moralis"

async function getTransactions(
  address: Address,
  chain: SupportedChains,
  numOfDays: number,
) {
  const transactions = await Moralis.EvmApi.wallets
    .getWalletHistory({
      chain: toHex(getChain(chain).id),
      order: "ASC",
      address: address,
      fromDate: new Date(Date.now() - numOfDays * 24 * 60 * 60 * 1000),
    })
    .then((res) => res.response.toJSON().result)

  return transactions as Transaction[]
}

export default getTransactions
