import { task, type HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox-viem"
import { SupportedChains } from "./data/types"
import calculateProfit from "./scripts/main"

task("chains", "Prints the list of supported chains").setAction(async () => {
  const supportedChains: string[] = Object.keys(SupportedChains).filter((key) =>
    isNaN(Number(key)),
  )

  console.log(supportedChains)
})

task("calc", "Calculate profit")
  .addParam("account", "Account address")
  .addParam(
    "chain",
    "Chain (print list of supported chains by running npx hardhat chains",
  )
  .addParam(
    "ignore",
    "Ignore transactions with profit above this number in USD (optional, default 1000)",
  )
  .setAction(async (taskArgs) => {
    await calculateProfit(
      taskArgs.account,
      taskArgs.chain,
      Number(taskArgs.ignore),
    )
  })

const config: HardhatUserConfig = {
  solidity: "0.8.24",
}

export default config
