const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { developmentChains } = require("../../constants/constant");
const { BigNumber } = require("ethers");

!developmentChains.includes(network.name) //if it isn't on localhost then skip if not proceed
    ?
    describe.skip
    :
    describe("StrtM", () => {
        let strtM;
        let deployer;
        const sendValue = ethers.utils.parseEther("1");
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"]); //helps us deploy all our contract containing all
            strtM = await ethers.getContract("StrtM", deployer);
        })

        // WORKING FOR CONSTRUCTOR
        describe("constructor", async () => {
            it("checks if owner is set properly", async () => {
                const response = await strtM.getOwner();
                assert.equal(response, deployer)
            })
        })

        // WORKING FOR CREATE MUSIC 
        describe("createMusic", async () => {
            it("checks if music is created successfully", async () => {
                const title = "nuel";
                const totalStreams = 2;
                const storageSpace = 6;
                const result = await strtM.createMusic(title, totalStreams, storageSpace, { value: sendValue })
                await expect(result)
                    .to.emit(strtM, "musicCreated")
            })
            it("checks if storage exceeding Error is working properly", async () => {
                const title = "nuel";
                const totalStreams = 2;
                const storageSpace = 16;
                await strtM.createMusic(title, totalStreams, storageSpace, { value: sendValue })
                await expect(strtM.createMusic(title, totalStreams, storageSpace, { value: sendValue })).to.be.revertedWithCustomError(
                    strtM,
                    "StrtM__spaceIsFull"
                )
            })
        })

        // WORKING FOR CLAIM BOUNTY 
        describe("claim Bounty", async () => {
            let title;
            beforeEach(async () => {
                title = "nuel";
                const totalStreams = 2;
                const storageSpace = 6;
                await strtM.createMusic(title, totalStreams, storageSpace, { value: sendValue })
            })
            it("checks if users claim bounty works", async () => {
                const result = await strtM.claimBounty(title)
                await expect(result)
                    .to.emit(strtM, "bountyPaid")
            })
            it("checks if user cannot stream a music more than once", async () => {
                await strtM.claimBounty(title);
                await expect(strtM.claimBounty(title)).to.be.revertedWithCustomError(strtM, "StrtM__streamed")
            })
        })

        // WORKING FOR ALLOCATED SPACE
        describe('allocated space', async () => {
            beforeEach(async () => {
                const title = "nuel";
                const totalStreams = 2;
                const storageSpace = 6;
                await strtM.createMusic(title, totalStreams, storageSpace, { value: sendValue })
                // it initializes the allocatedSpace var to 20 when we create music for the first
            })
            it("check if allocated space increases when upgraded", async () => {
                const space = (sendValue / 1000000000000000000) * 20;
                await strtM.increaseSpace({ value: sendValue });
                const mainSpace = await strtM.getAllocatedSpace();
                assert.equal(space + 20, mainSpace)
            })
            it("check if allocated space event is successfully emitted", async () => {
                const result = await strtM.increaseSpace({ value: sendValue });
                await expect(result)
                    .to.emit(strtM, "allocatedSpaceFundz")
            })
        })

        // WORKING FOR WIDTHDRAW BY ONLY ADMIN
        describe('Withdraw', async () => {
            beforeEach(async () => {
                await strtM.increaseSpace({ value: sendValue });
            })
            it("check if it rejects another another signer except owner", async () => {
                const [owner, addr1] = await ethers.getSigners()
                await expect(strtM.connect(addr1).withdraw()).to.be.revertedWithCustomError(strtM, "StrtM__NotAuthorized")

            })
            it("check if it allocatedFudnz is empty", async () => {
                await strtM.withdraw();
                const result = await strtM.getAllocatedSpaceFundz();
                assert.equal(result, 0)
            })
        })
    })