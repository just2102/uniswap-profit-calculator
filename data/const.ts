import { Chain } from "viem"
import { arbitrum } from "viem/chains"
import { SupportedChains } from "./types"

const uniswapPoolNftContracts: Record<SupportedChains, string> = {
  [SupportedChains.ArbitrumOne]: "0xc36442b4a4522e871399cd717abdd847ab11fe88", // V3
}

export const ONE_MONTH_S = 31 * 24 * 60 * 60 // 31 day in seconds
export const ONE_HOUR_S = 60 * 60 // 1 hour in seconds
export const ONE_MINUTE_S = 60 // 1 minute in seconds

export const ChainDictionary: Record<SupportedChains, Chain> = {
  [SupportedChains.ArbitrumOne]: arbitrum,
}

const WETHAddresses: Record<SupportedChains, string> = {
  [SupportedChains.ArbitrumOne]: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
}

export function getChain(chain: SupportedChains) {
  const occurrence = ChainDictionary[chain]

  if (!occurrence) {
    throw new Error(`Chain ${chain} is not supported`)
  }

  return occurrence
}

export function getUniswapPoolNftContract(chain: SupportedChains) {
  const occurrence = uniswapPoolNftContracts[chain]

  if (!occurrence) {
    throw new Error(`Chain ${chain} is not supported`)
  }

  return occurrence
}

export function getWETHAddress(chain: SupportedChains) {
  const occurrence = WETHAddresses[chain]

  if (!occurrence) {
    throw new Error(`Chain ${chain} is not supported`)
  }

  return occurrence
}
