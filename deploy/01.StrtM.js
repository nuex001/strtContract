const { network } = require("hardhat");
const { verify } = require("../utils/verify");
const { developmentChains } = require("../constants/constant")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const piggyBank = await deploy("StrtM", {
      from: deployer,
      args: [],
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1,
  })
  log("________________________________")
  if (
      !developmentChains.includes(network.name) &&
      process.env.ETHERSCAN_API_KEY
  ) {
      await verify(piggyBank.address, [])
  }
}
module.exports.tags = ["all"]