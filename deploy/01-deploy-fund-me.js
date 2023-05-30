
const {networkConfig, developmentChains} = require("../helper-hardhat-config")
//above code is same as: const helper config = require("../helper-hardhat-config") THEN networkConfig = helper.networkConfig
const {network} = require("hardhat")
const {verify} = require("../utils/verify")
require("dotenv").config()

module.exports = async ({getNamedAccounts, deployments}) => {
    //const {getNamedAccounts, deployments} = hre //this pulls getNamesAccounts and deployments out of hre. Similar to hre.getNamedAccounts etc. Above way even more efficient 
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts() 
    const chainId = network.config.chainId

    //return corresponding ethusd pricefeed address depending on chainId
    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"] 
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggreagtor = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggreagtor.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //put price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
      await verify(fundMe.address, args)
    } 
    log("-------------")
}

module.exports.tags = ["all", "fundme"]