const { getNamedAccounts, ethers } = require("hardhat")
async function main() {
    const { deployer } = await getNamedAccounts()
    strtM = await ethers.getContract("StrtM", deployer);
    const sendValue = ethers.utils.parseEther("1");
    console.log("Increasing Space.....")
   const transactionResponse = await strtM.increaseSpace({ value: sendValue });
   await transactionResponse.wait(1);
    console.log("Increased!")
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
