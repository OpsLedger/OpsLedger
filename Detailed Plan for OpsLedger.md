### **Detailed Plan for OpsLedger: A Blockchain-Based CI/CD Pipeline with NFT Integration**

#### **Goal**
Build and deploy OpsLedger within three days. The project will include blockchain-based logging for CI/CD events, NFT rewards for successful deployments, and a dashboard for viewing these logs and achievements.

---
Organizing your project into well-structured directories will help you manage each component effectively and streamline the integration process. Below is a detailed guide on how to set up the directories for each component of **OpsLedger** and how to integrate them.

---

### **Project Directory Structure**

Here's a suggested directory structure for the OpsLedger project:

```
OpsLedger/
├── blockchain/
│   ├── contracts/
│   │   ├── OpsLedger.sol
│   │   ├── DeploymentNFT.sol
│   ├── scripts/
│   │   ├── deploy.js
│   │   ├── interact.js
│   ├── test/
│   ├── hardhat.config.js
│   ├── package.json
├── ci-cd/
│   ├── Jenkinsfile
│   ├── scripts/
│   │   ├── logEvent.js
│   │   ├── mintNFT.js
│   ├── package.json
├── dashboard/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── NFTGallery.js
│   │   ├── App.js
│   ├── package.json
├── infra/
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
├── README.md
├── .gitignore
```

---

### **Component Breakdown and Integration**

#### **1. Blockchain Component (`/blockchain/`)**

**Purpose**: Contains all blockchain-related code, including smart contracts and deployment scripts.

**Directory Structure**:

- `contracts/`: Smart contracts written in Solidity.
  - `OpsLedger.sol`: Smart contract for logging CI/CD events.
  - `DeploymentNFT.sol`: Smart contract for minting NFTs.
- `scripts/`: Scripts to deploy and interact with smart contracts.
  - `deploy.js`: Script to deploy contracts to the blockchain.
  - `interact.js`: Script to interact with deployed contracts (optional).
- `test/`: Unit tests for smart contracts.
- `hardhat.config.js`: Configuration file for Hardhat.
- `package.json`: Node.js project configuration.

**Setup Steps**:

1. **Initialize the Node.js Project**:

   ```bash
   cd OpsLedger
   mkdir blockchain
   cd blockchain
   npm init -y
   ```

2. **Install Dependencies**:

   ```bash
   npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
   npm install @openzeppelin/contracts
   ```

3. **Initialize Hardhat**:

   ```bash
   npx hardhat
   ```

   - Choose "Create a basic sample project".
   - This will create some default files which you can modify or replace.

4. **Write Smart Contracts**:

   - **OpsLedger.sol**: Place this in the `contracts/` directory.

     ```solidity
     // SPDX-License-Identifier: MIT
     pragma solidity ^0.8.0;

     contract OpsLedger {
         struct Event {
             uint256 timestamp;
             string buildId;
             string status;
             string developer;
         }

         Event[] public events;

         event NewEvent(uint256 indexed timestamp, string buildId, string status, string developer);

         function logEvent(string memory _buildId, string memory _status, string memory _developer) public {
             events.push(Event(block.timestamp, _buildId, _status, _developer));
             emit NewEvent(block.timestamp, _buildId, _status, _developer);
         }

         function getEvents() public view returns (Event[] memory) {
             return events;
         }
     }
     ```

   - **DeploymentNFT.sol**: Also place this in the `contracts/` directory.

     ```solidity
     // SPDX-License-Identifier: MIT
     pragma solidity ^0.8.0;

     import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

     contract DeploymentNFT is ERC721 {
         uint256 public tokenCount;

         constructor() ERC721("OpsLedger NFT", "OPLNFT") {}

         function mintNFT(address _to) public returns (uint256) {
             tokenCount++;
             _mint(_to, tokenCount);
             return tokenCount;
         }
     }
     ```

5. **Configure Hardhat (`hardhat.config.js`)**:

   Update the configuration to include the network you plan to deploy to (e.g., Base Testnet):

   ```javascript
   require("@nomiclabs/hardhat-ethers");

   module.exports = {
     defaultNetwork: "baseTestnet",
     networks: {
       baseTestnet: {
         url: "https://base-goerli.blockapi.com/v3/YOUR-API-KEY",
         accounts: ["0xYOUR_PRIVATE_KEY"],
       },
     },
     solidity: "0.8.0",
   };
   ```

6. **Write Deployment Scripts (`scripts/deploy.js`)**:

   ```javascript
   const hre = require("hardhat");

   async function main() {
     // Deploy OpsLedger contract
     const OpsLedger = await hre.ethers.getContractFactory("OpsLedger");
     const opsLedger = await OpsLedger.deploy();
     await opsLedger.deployed();
     console.log("OpsLedger deployed to:", opsLedger.address);

     // Deploy DeploymentNFT contract
     const DeploymentNFT = await hre.ethers.getContractFactory("DeploymentNFT");
     const deploymentNFT = await DeploymentNFT.deploy();
     await deploymentNFT.deployed();
     console.log("DeploymentNFT deployed to:", deploymentNFT.address);
   }

   main()
     .then(() => process.exit(0))
     .catch((error) => {
       console.error(error);
       process.exit(1);
     });
   ```

7. **Deploy Contracts**:

   ```bash
   npx hardhat run scripts/deploy.js --network baseTestnet
   ```

   - Record the deployed contract addresses; you'll need them for integration.

8. **Share Contract ABIs and Addresses**:

   - Copy the ABI files generated in `artifacts/contracts/` to a shared location or directly into the `ci-cd/` and `dashboard/` components.

---

#### **2. CI/CD Component (`/ci-cd/`)**

**Purpose**: Contains the CI/CD pipeline configuration and scripts for logging events and minting NFTs.

**Directory Structure**:

- `Jenkinsfile`: Configuration for the Jenkins pipeline.
- `scripts/`: Node.js scripts to interact with the blockchain.
  - `logEvent.js`: Logs CI/CD events to the blockchain.
  - `mintNFT.js`: Mints NFTs upon successful deployments.
- `package.json`: Node.js project configuration.

**Setup Steps**:

1. **Initialize the Node.js Project**:

   ```bash
   cd OpsLedger
   mkdir ci-cd
   cd ci-cd
   npm init -y
   ```

2. **Install Dependencies**:

   ```bash
   npm install web3 dotenv
   ```

3. **Create Environment Variables File (`.env`)**:

   - Store sensitive information like private keys and API URLs.

     ```
     PRIVATE_KEY=your_private_key
     INFURA_API_URL=https://base-goerli.blockapi.com/v3/YOUR-API-KEY
     OPSLEDGER_CONTRACT_ADDRESS=deployed_opsledger_address
     OPSLEDGER_ABI_PATH=path_to_opsledger_abi.json
     DEPLOYMENTNFT_CONTRACT_ADDRESS=deployed_nft_contract_address
     DEPLOYMENTNFT_ABI_PATH=path_to_deploymentnft_abi.json
     ```

4. **Write `logEvent.js` Script**:

   ```javascript
   require('dotenv').config();
   const Web3 = require('web3');
   const fs = require('fs');

   const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_API_URL));
   const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
   web3.eth.accounts.wallet.add(account);

   const opsLedgerABI = JSON.parse(fs.readFileSync(process.env.OPSLEDGER_ABI_PATH));
   const opsLedgerContract = new web3.eth.Contract(opsLedgerABI, process.env.OPSLEDGER_CONTRACT_ADDRESS);

   const logEventToBlockchain = async (buildId, status, developer) => {
     try {
       await opsLedgerContract.methods.logEvent(buildId, status, developer)
         .send({ from: account.address, gas: 300000 });
       console.log('Event logged successfully');
     } catch (error) {
       console.error('Error logging event:', error);
     }
   };

   const [,, buildId, status, developer] = process.argv;

   logEventToBlockchain(buildId, status, developer);
   ```

5. **Write `mintNFT.js` Script**:

   ```javascript
   require('dotenv').config();
   const Web3 = require('web3');
   const fs = require('fs');

   const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_API_URL));
   const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
   web3.eth.accounts.wallet.add(account);

   const nftABI = JSON.parse(fs.readFileSync(process.env.DEPLOYMENTNFT_ABI_PATH));
   const nftContract = new web3.eth.Contract(nftABI, process.env.DEPLOYMENTNFT_CONTRACT_ADDRESS);

   const mintNFT = async (developerAddress) => {
     try {
       await nftContract.methods.mintNFT(developerAddress)
         .send({ from: account.address, gas: 300000 });
       console.log('NFT minted successfully');
     } catch (error) {
       console.error('Error minting NFT:', error);
     }
   };

   const [,, developerAddress] = process.argv;

   mintNFT(developerAddress);
   ```

6. **Configure the Jenkins Pipeline (`Jenkinsfile`)**:

   ```groovy
   pipeline {
       agent any
       stages {
           stage('Build') {
               steps {
                   sh 'npm install'
                   sh 'npm run build'
               }
           }
           stage('Test') {
               steps {
                   sh 'npm test'
               }
           }
       }
       post {
           always {
               script {
                   def buildStatus = currentBuild.result ?: 'SUCCESS'
                   def developer = "${env.BUILD_USER_ID}"
                   sh "node scripts/logEvent.js ${currentBuild.id} ${buildStatus} ${developer}"
               }
           }
           success {
               script {
                   def developerAddress = "0xDeveloperEthereumAddress" // Map BUILD_USER_ID to Ethereum address
                   sh "node scripts/mintNFT.js ${developerAddress}"
               }
           }
       }
   }
   ```

7. **Integration with Blockchain**:

   - Ensure the scripts have access to the correct ABI files and contract addresses.
   - Use the `.env` file to manage configuration.

---

#### **3. Dashboard Component (`/dashboard/`)**

**Purpose**: A React application that displays CI/CD logs and developer NFTs.

**Directory Structure**:

- `src/`:
  - `components/`:
    - `Dashboard.js`: Displays the CI/CD events.
    - `NFTGallery.js`: Displays NFTs owned by developers.
  - `App.js`: Main application file.
- `package.json`: React project configuration.

**Setup Steps**:

1. **Initialize the React App**:

   ```bash
   cd OpsLedger
   npx create-react-app dashboard
   cd dashboard
   ```

2. **Install Dependencies**:

   ```bash
   npm install ethers dotenv
   ```

3. **Create Environment Variables File (`.env`)**:

   ```
   REACT_APP_INFURA_API_URL=https://base-goerli.blockapi.com/v3/YOUR-API-KEY
   REACT_APP_OPSLEDGER_CONTRACT_ADDRESS=deployed_opsledger_address
   REACT_APP_OPSLEDGER_ABI_PATH=src/abis/OpsLedger.json
   REACT_APP_DEPLOYMENTNFT_CONTRACT_ADDRESS=deployed_nft_contract_address
   REACT_APP_DEPLOYMENTNFT_ABI_PATH=src/abis/DeploymentNFT.json
   ```

4. **Copy ABI Files**:

   - Place the ABI JSON files into `src/abis/`.

5. **Develop `Dashboard.js` Component**:

   ```javascript
   import React, { useState, useEffect } from 'react';
   import { ethers } from 'ethers';
   import OpsLedgerABI from '../abis/OpsLedger.json';

   function Dashboard() {
     const [events, setEvents] = useState([]);

     useEffect(() => {
       const fetchEvents = async () => {
         const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_INFURA_API_URL);
         const contract = new ethers.Contract(
           process.env.REACT_APP_OPSLEDGER_CONTRACT_ADDRESS,
           OpsLedgerABI,
           provider
         );

         try {
           const eventList = await contract.getEvents();
           setEvents(eventList);
         } catch (error) {
           console.error('Error fetching events:', error);
         }
       };

       fetchEvents();
     }, []);

     return (
       <div>
         <h1>OpsLedger CI/CD Logs</h1>
         <table>
           <thead>
             <tr>
               <th>Timestamp</th>
               <th>Build ID</th>
               <th>Status</th>
               <th>Developer</th>
             </tr>
           </thead>
           <tbody>
             {events.map((event, index) => (
               <tr key={index}>
                 <td>{new Date(event.timestamp.toNumber() * 1000).toLocaleString()}</td>
                 <td>{event.buildId}</td>
                 <td>{event.status}</td>
                 <td>{event.developer}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     );
   }

   export default Dashboard;
   ```

6. **Develop `NFTGallery.js` Component** (Optional):

   - Display NFTs owned by developers.

7. **Integrate Components in `App.js`**:

   ```javascript
   import React from 'react';
   import Dashboard from './components/Dashboard';
   // import NFTGallery from './components/NFTGallery';

   function App() {
     return (
       <div className="App">
         <Dashboard />
         {/* <NFTGallery /> */}
       </div>
     );
   }

   export default App;
   ```

8. **Run the Dashboard**:

   ```bash
   npm start
   ```

---

#### **4. Infrastructure Automation (`/infra/`)**

**Purpose**: Contains Terraform scripts for automating the deployment of infrastructure.

**Directory Structure**:

- `terraform/`:
  - `main.tf`: Main configuration file.
  - `variables.tf`: Variables used in configurations.
  - `outputs.tf`: Output definitions.

**Setup Steps**:

1. **Write Terraform Configuration (`main.tf`)**:

   ```hcl
   provider "aws" {
     region = "us-west-2"
   }

   resource "aws_instance" "jenkins_server" {
     ami           = "ami-0c55b159cbfafe1f0" # Ubuntu Server 18.04 LTS
     instance_type = "t2.micro"

     tags = {
       Name = "JenkinsServer"
     }

     # ... other configurations (security groups, key pairs, etc.)
   }

   resource "aws_instance" "dashboard_server" {
     ami           = "ami-0c55b159cbfafe1f0"
     instance_type = "t2.micro"

     tags = {
       Name = "DashboardServer"
     }

     # ... other configurations
   }
   ```

2. **Initialize and Apply Terraform**:

   ```bash
   cd OpsLedger/infra/terraform
   terraform init
   terraform apply
   ```

3. **Configure Provisioning Scripts** (Optional):

   - Use Terraform's provisioning capabilities to install dependencies and set up servers after they're created.

---

### **Integration Steps**

1. **Sharing Contract Details**:

   - Ensure that the contract ABIs and addresses are correctly shared between the blockchain, CI/CD, and dashboard components.
   - Use a common location or script to distribute these details.

2. **Environment Variables**:

   - Use `.env` files in each component to store configuration settings.
   - Never commit `.env` files to version control; add them to `.gitignore`.

3. **Version Control**:

   - Initialize a Git repository at the root of the `OpsLedger` directory.

     ```bash
     cd OpsLedger
     git init
     ```

   - Add a `.gitignore` file to exclude node modules and sensitive files.

     ```
     node_modules/
     .env
     ```

4. **Documentation**:

   - Update `README.md` with setup instructions for each component.
   - Include details on how to install dependencies, deploy contracts, and run the application.

---

### **Starting Point**

1. **Begin with the Blockchain Component**:

   - Navigate to `OpsLedger/blockchain/` and start by writing and deploying the smart contracts.

2. **Proceed to CI/CD Component**:

   - Move to `OpsLedger/ci-cd/` to set up the Node.js scripts and Jenkins pipeline.
   - Ensure the CI/CD scripts can interact with the deployed contracts.

3. **Develop the Dashboard**:

   - Navigate to `OpsLedger/dashboard/` and build the React application.
   - Test fetching data from the blockchain.

4. **Set Up Infrastructure**:

   - Use Terraform scripts in `OpsLedger/infra/terraform/` to deploy servers for Jenkins and the dashboard.

5. **Testing and Integration**:

   - Run test builds through Jenkins to ensure events are logged.
   - Verify that the dashboard displays the logged events and NFTs correctly.

---

### **Best Practices**

- **Modular Development**:

  - Keep components decoupled to allow parallel development.

- **Secure Handling of Sensitive Data**:

  - Use environment variables for private keys and API URLs.
  - Consider using a secrets manager for production environments.

- **Automated Deployment**:

  - Use scripts and configuration management to automate deployment steps wherever possible.

- **Code Quality**:

  - Implement linting and formatting tools.
  - Write unit tests for smart contracts and scripts.

- **Continuous Integration**:

  - Set up automated builds and tests in Jenkins to catch issues early.

---

### **Summary**

By following this structured approach, you'll create a cohesive project where each component—blockchain, CI/CD, dashboard, and infrastructure—is organized in its own directory with clear responsibilities. Integration is achieved through shared configurations and careful coordination of contract addresses and ABIs.

---

**Next Steps**:

- **Day 1**: Start with the blockchain component and deploy the smart contracts.
- **Day 1 Afternoon**: Set up the CI/CD scripts and integrate them with your Jenkins pipeline.
- **Day 2 Morning**: Develop the NFT minting script and integrate it into the CI/CD pipeline.
- **Day 2 Afternoon**: Build the dashboard and ensure it can read data from the blockchain.
- **Day 3**: Automate the infrastructure deployment with Terraform, and perform end-to-end testing.

Let me know if you need further assistance on any specific part of this setup!
