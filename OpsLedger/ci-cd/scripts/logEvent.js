const Web3 = require('web3');
const web3 = new Web3('https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID');

const contractAddress = '0xYourContractAddress';
const abi = [...]  // ABI from your contract

const contract = new web3.eth.Contract(abi, contractAddress);

const logBuildToBlockchain = async (buildId, status, developer) => {
    try {
        await contract.methods.logBuild(buildId, status, developer)
            .send({ from: '0xYourAddress', gas: 300000 });
        console.log('Build logged successfully');
    } catch (error) {
        console.error('Error logging build:', error);
    }
};

const buildId = process.argv[2];  // pass build ID as argument
const status = process.argv[3];   // pass build status
const developer = process.argv[4]; // pass developer's name

logBuildToBlockchain(buildId, status, developer);

