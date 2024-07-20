export enum SupportedChains {
  ArbitrumOne = "ArbitrumOne",
}

interface NativeTransfer {
  from_address: string
  from_address_label: string | null
  to_address: string
  to_address_label: string | null
  value: string
  value_formatted: string
  direction: string
  internal_transaction: boolean
  token_symbol: string
  token_logo: string
}

interface ERC20Transfer {
  token_name: string
  token_symbol: string
  token_logo: string
  token_decimals: string
  address: string
  to_address: string
  to_address_label: string | null
  from_address: string
  from_address_label: string | null
  value: string
  value_formatted: string
  log_index: number
  possible_spam: boolean
  verified_contract: boolean
}

export interface Transaction {
  hash: string
  nonce: string
  transaction_index: string
  from_address: string
  from_address_label: string | null
  to_address: string
  to_address_label: string
  value: string
  gas: string
  gas_price: string
  receipt_cumulative_gas_used: string
  receipt_gas_used: string
  receipt_contract_address: string | null
  receipt_status: string
  transaction_fee: string
  block_timestamp: string
  block_number: string
  block_hash: string
  category: string
  possible_spam: boolean
  method_label: string
  summary: string
  nft_transfers: any[]
  erc20_transfers: ERC20Transfer[]
  native_transfers: NativeTransfer[]
}
