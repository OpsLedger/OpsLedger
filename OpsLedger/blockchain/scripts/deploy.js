async function main() {
    const CICDLogger = await ethers.getContractFactory("CICDLogger");
    const logger = await CICDLogger.deploy();
    await logger.deployed();
    console.log("Contract deployed to:", logger.address);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

