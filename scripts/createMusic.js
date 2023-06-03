const { getNamedAccounts, ethers } = require("hardhat")
async function main() {
    const { deployer } = await getNamedAccounts()
    strtM = await ethers.getContract("StrtM", deployer);
    const sendValue = ethers.utils.parseEther("1");
    console.log("Creating Music.....")
    const title = "nuel";
    const totalStreams = 2;
    const storageSpace = 6;
    const transactionResponse = await strtM.createMusic(title, totalStreams, storageSpace, { value: sendValue })
    await transactionResponse.wait(1)
    console.log("Created!")
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
