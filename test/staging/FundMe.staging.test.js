const { getNamedAccounts, ethers, network } = require("hardhat")
const {developmentChains} = require("../../helper-hardhat-config")
const {asset, assert} = require("chai")


//below line is basically: if(development chains includes network name) {describe}, {Skip}
developmentChains.includes(network.name) ? describe.skip :
    describe("FundMe", async function() {
        
        let fundMe 
        let deployer 
        const sendValue = ethers.utils.parseEther("1")
        this.beforeEach(async function() {
            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContract("FundMe", deployer)
        })

        it("allows people to fund and wthdraw", async function() {
            await fundMe.fund({value: sendValue})
            await fundMe.withdraw()
            const endingBalance = await fundMe.provider.getBalance(fundMe.address)
            assert.equal(endingBalance.toString(),"0")
        }) 
        
    })