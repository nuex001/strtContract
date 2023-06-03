const { getNamedAccounts, ethers } = require("hardhat")
async function main() {
    const { deployer } = await getNamedAccounts()
    strtM = await ethers.getContract("StrtM", deployer);
    const sendValue = ethers.utils.parseEther("1");
    console.log("Withdrawing fundsAllocated.....")
    const title = "nuel";
    const transactionResponse = await strtM.withdraw();
    await transactionResponse.wait(1)
    console.log("withdraw successfully!")
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
