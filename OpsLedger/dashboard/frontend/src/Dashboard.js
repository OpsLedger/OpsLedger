import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const contractAddress = '0xYourContractAddress';
const abi = [...]  // ABI from your contract

function Dashboard() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchEvents() {
            const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID');
            const contract = new ethers.Contract(contractAddress, abi, provider);
            const logs = await contract.getEvents();  // Fetch events from blockchain
            setEvents(logs);
        }
        fetchEvents();
    }, []);

    return (
        <div>
            <h1>CI/CD Blockchain Logs</h1>
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
                            <td>{new Date(event.timestamp * 1000).toLocaleString()}</td>
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

