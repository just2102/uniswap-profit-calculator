import { Chain } from "viem"
import { arbitrum, unichain, base } from "viem/chains"
import { SupportedChains } from "./types"
import { Network } from "alchemy-sdk"

/**
 * Contracts responsible for the rewards distribution
 */
const uniswapPoolNftContracts: Record<SupportedChains, string> = {
  [SupportedChains.ArbitrumOne]: "0xc36442b4a4522e871399cd717abdd847ab11fe88", // V3
  [SupportedChains.Unichain]: "0x1F98400000000000000000000000000000000004", // V4 Pool Manager
  [SupportedChains.Base]: "0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1", // V3
}

export const SECONDS_PER_DAY = 24 * 60 * 60
export const ONE_MONTH_S = 31 * SECONDS_PER_DAY // 31 day in seconds
export const ONE_HOUR_S = 60 * 60 // 1 hour in seconds
export const ONE_MINUTE_S = 60 // 1 minute in seconds

/**
 * Block time in seconds
 */
export const BlockTimes: Partial<Record<SupportedChains, number>> = {
  [SupportedChains.ArbitrumOne]: 0.26,
  [SupportedChains.Unichain]: 1,
}

export const ChainDictionary: Record<SupportedChains, Chain> = {
  [SupportedChains.ArbitrumOne]: arbitrum,
  [SupportedChains.Unichain]: unichain,
  [SupportedChains.Base]: base,
}

export const AlchemyChainDictionary: Partial<Record<SupportedChains, Network>> =
  {
    [SupportedChains.Unichain]: Network.UNICHAIN_MAINNET,
  }

const WETHAddresses: Record<SupportedChains, string> = {
  [SupportedChains.ArbitrumOne]: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
  [SupportedChains.Unichain]: "0x4200000000000000000000000000000000000006",
  [SupportedChains.Base]: "0x4200000000000000000000000000000000000006",
}

export function getChain(chain: SupportedChains) {
  const occurrence = ChainDictionary[chain]

  if (!occurrence) {
    throw new Error(`Chain ${chain} is not supported`)
  }

  return occurrence
}

export function getAlchemyChain(chain: SupportedChains) {
  const occurrence = AlchemyChainDictionary[chain]

  if (!occurrence) {
    throw new Error(`Chain ${chain} is not supported for Alchemy`)
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
