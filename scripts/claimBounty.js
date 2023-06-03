const { getNamedAccounts, ethers } = require("hardhat")
async function main() {
    const { deployer } = await getNamedAccounts()
    strtM = await ethers.getContract("StrtM", deployer);
    const sendValue = ethers.utils.parseEther("1");
    console.log("Claming Bounty.....")
    const title = "nuel";
    const transactionResponse = await strtM.claimBounty(title)
    await transactionResponse.wait(1)
    console.log("Claimed!")
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
