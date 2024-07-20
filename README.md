# Uniswap V3 Pools Profit Calculator

This project provides tools to calculate profits from Uniswap V3 pools, using Hardhat for task management and automation.

## Installation

Ensure you have Node.js and npm installed, then install the required dependencies:

```shell
npm install
```

## Available Commands

### List Supported Chains

Prints the list of supported chains.

```shell
npx hardhat chains
```

### Calculate Profit

Calculates profit for a given account on a specified chain for a given period (currently fixed at 1 month), with a parameter to ignore transactions with profit above a specified amount in USD.

```shell
npx hardhat calc --account {account} --chain {chain} --ignore {ignore}
```

- `account`: Account address to calculate profit for.
- `chain`: Chain to perform the calculation on (run `npx hardhat chains` to see the list of supported chains).
- `ignore`: Ignore transactions with profit above this number in USD (recommended: 1000).

## Example Usage

1. List the supported chains:

   ```shell
   npx hardhat chains
   ```

2. Calculate profit:

   ```shell
   npx hardhat calc --account 0xYourAccountAddress --chain eth-mainnet --ignore 1000
   ```

## Project Structure

- `scripts/main.ts`: Contains the `calculateProfit` function to perform profit calculation.
- `data/types.ts`: Defines the `SupportedChains` type and list.
