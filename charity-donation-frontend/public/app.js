const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update if needed
const TARGET_NETWORK_ID = "31337"; // Hardhat Network

const CONTRACT_ABI = [  // Your provided ABI
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "donor", "type": "address" },
            { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "indexed": false, "internalType": "string", "name": "institutionId", "type": "string" }
        ],
        "name": "DonationReceived",
        "type": "event"
    },
    {
        "inputs": [{ "internalType": "string", "name": "id", "type": "string" }],
        "name": "approveInstitution",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "institutionId", "type": "string" }],
        "name": "donate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllDonations",
        "outputs": [{
            "components": [
                { "internalType": "address", "name": "donor", "type": "address" },
                { "internalType": "uint256", "name": "amount", "type": "uint256" },
                { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
                { "internalType": "string", "name": "institutionId", "type": "string" }
            ],
            "internalType": "struct CharityDonation.Donation[]",
            "name": "",
            "type": "tuple[]"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getInstitutions",
        "outputs": [{
            "components": [
                { "internalType": "string", "name": "id", "type": "string" },
                { "internalType": "string", "name": "name", "type": "string" },
                { "internalType": "string", "name": "description", "type": "string" },
                { "internalType": "address", "name": "wallet", "type": "address" },
                { "internalType": "bool", "name": "approved", "type": "bool" }
            ],
            "internalType": "struct CharityDonation.Institution[]",
            "name": "",
            "type": "tuple[]"
        }],
        "stateMutability": "view",
        "type": "function"
    }
];

let provider, signer, contract;

async function initWeb3() {
    if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return false;
    }

    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        const network = await provider.getNetwork();

        if (network.chainId.toString() !== TARGET_NETWORK_ID) {
            await switchNetwork();
        }

        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        return true;
    } catch (error) {
        console.error("Web3 initialization failed:", error);
        return false;
    }
}

async function connectWallet() {
    showLoader();
    try {
        if (!provider) {
            const initialized = await initWeb3();
            if (!initialized) {
                alert("Failed to initialize Web3.");
                hideLoader();
                return;
            }
        }

        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts.length > 0) {
            document.querySelector(".wallet-address").textContent = accounts[0];
            document.getElementById("connectWallet").textContent = "Connected";
        }
    } catch (error) {
        console.error("Wallet connection failed:", error);
        alert(error.message || "Connection failed");
    } finally {
        hideLoader();
    }
}

async function switchNetwork() {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ethers.utils.hexlify(parseInt(TARGET_NETWORK_ID)) }]
        });
    } catch (error) {
        console.error("Network switch error:", error);
        alert("Please switch to the correct network in MetaMask.");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const initialized = await initWeb3();
    if (initialized) {
        window.ethereum.on("accountsChanged", () => location.reload());
        window.ethereum.on("chainChanged", () => location.reload());
    }

    document.getElementById("connectWallet").addEventListener("click", connectWallet);
});
