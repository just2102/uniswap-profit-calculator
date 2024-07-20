import { Chain } from "viem"
import { arbitrum } from "viem/chains"
import { SupportedChains } from "./types"

const uniswapPoolNftContracts: Map<SupportedChains, string> = new Map([
  [SupportedChains.ArbitrumOne, "0xc36442b4a4522e871399cd717abdd847ab11fe88"],
])

export const ONE_MONTH_S = 31 * 24 * 60 * 60 // 31 day in seconds
export const ONE_HOUR_S = 60 * 60 // 1 hour in seconds
export const ONE_MINUTE_S = 60 // 1 minute in seconds

export const SupportedChainToChainMap: Map<SupportedChains, Chain> = new Map([
  [SupportedChains.ArbitrumOne, arbitrum],
])

/**
 * Block time in seconds
 */
const BlockTimes: Map<SupportedChains, number> = new Map([
  [SupportedChains.ArbitrumOne, 0.26],
])

const WETHAddresses: Map<SupportedChains, string> = new Map([
  [SupportedChains.ArbitrumOne, "0x82af49447d8a07e3bd95bd0d56f35241523fbab1"],
])

export function getChain(chain: SupportedChains) {
  const occurrence = SupportedChainToChainMap.get(chain)

  if (!occurrence) {
    throw new Error(`Chain ${chain} is not supported`)
  }

  return occurrence
}

export function getBlockTime(chain: SupportedChains) {
  const occurrence = BlockTimes.get(chain)

  if (!occurrence) {
    throw new Error(`Chain ${chain} is not supported`)
  }

  return occurrence
}

export function getUniswapPoolNftContract(chain: SupportedChains) {
  const occurrence = uniswapPoolNftContracts.get(chain)

  if (!occurrence) {
    throw new Error(`Chain ${chain} is not supported`)
  }

  return occurrence
}

export function getWETHAddress(chain: SupportedChains) {
  const occurrence = WETHAddresses.get(chain)

  if (!occurrence) {
    throw new Error(`Chain ${chain} is not supported`)
  }

  return occurrence
}
