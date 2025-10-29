# 🔗 RWA DApp - Blockchain Setup Guide

This guide will help you set up and run the Real-World Asset Tokenization DApp on a private blockchain.

## 📋 Prerequisites

- Node.js v18 or higher ([Download](https://nodejs.org/))
- npm or yarn package manager

## 🚀 Quick Start (3 Steps)

### Step 1: Install Blockchain Dependencies

First, install Hardhat and related dependencies in the project root:

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install ethers@^6.0.0
```

### Step 2: Start Local Blockchain

Start a local Hardhat node (keeps running in this terminal):

```bash
npx hardhat node
```

You should see:
- ✅ Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
- 📝 A list of 20 test accounts with private keys
- 💰 Each account has 10000 ETH

**Keep this terminal running!**

### Step 3: Deploy Smart Contract

Open a **NEW terminal** and deploy the RWA contract:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

You should see:
- ✅ Contract deployed to: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- 📁 Contract files saved to `src/contracts/`

## 🎨 Running the Frontend

In the **same terminal** where you deployed (or a new one):

```bash
npm run dev
```

Visit: **http://localhost:8080**

## 🧪 Testing the DApp

### Test Accounts

The local blockchain provides test accounts. Here are the first two (copy from your terminal output):

```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
```

### Test Scenarios

1. **Tokenize an Asset:**
   - Name: "Luxury Villa Miami"
   - Type: "Real Estate"
   - Value: 5000000 (represents $5M)
   - Click "Tokenize Asset"
   - ✅ You'll receive an Asset ID (e.g., 1)

2. **Query an Asset:**
   - Enter the Asset ID: 1
   - Click "Query Asset"
   - ✅ View all asset details

3. **Transfer an Asset:**
   - Asset ID: 1
   - New Owner: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
   - Click "Transfer Asset"
   - ✅ Ownership transferred

## 🏗️ Project Structure

```
project-root/
├── contracts/
│   └── RWA.sol                  # Smart contract
├── scripts/
│   └── deploy.js                # Deployment script
├── hardhat.config.js            # Hardhat configuration
├── src/
│   ├── contracts/               # Auto-generated after deployment
│   │   ├── contract-address.json
│   │   └── RWA.json (ABI)
│   ├── components/
│   │   ├── TokenizeForm.tsx     # Asset tokenization UI
│   │   ├── QueryAsset.tsx       # Asset query UI
│   │   └── TransferAsset.tsx    # Asset transfer UI
│   └── pages/
│       └── Index.tsx            # Main DApp page
└── BLOCKCHAIN_SETUP.md          # This file
```

## 🔧 Troubleshooting

### Issue: "Cannot connect to blockchain"

**Solution:**
- Ensure Hardhat node is running: `npx hardhat node`
- Check connection URL: http://127.0.0.1:8545
- Verify no other process is using port 8545

### Issue: "Contract not deployed"

**Solution:**
- Run deployment: `npx hardhat run scripts/deploy.js --network localhost`
- Check `src/contracts/contract-address.json` exists
- Restart frontend: `npm run dev`

### Issue: "Transaction failed"

**Solution:**
- Check console for error messages
- Ensure you're using a valid account address
- Restart Hardhat node and redeploy

### Issue: Port 8545 already in use

**Solution:**
```bash
# Find process using port 8545
lsof -i :8545

# Kill the process
kill -9 <PID>

# Or use a different port in hardhat.config.js
```

## 📚 Smart Contract Functions

### `tokenizeAsset(name, assetType, value)`
- Tokenizes a new real-world asset
- Returns: Asset ID
- Emits: `AssetTokenized` event

### `transferAsset(assetId, newOwner)`
- Transfers asset ownership
- Requires: Current owner only
- Emits: `AssetTransferred` event

### `getAsset(assetId)`
- Retrieves asset details
- Returns: id, name, type, value, owner, timestamp

### `getAllAssetIds()`
- Returns array of all tokenized asset IDs

### `getTotalAssets()`
- Returns total count of assets

## 🎯 Key Features

✅ **No MetaMask Required** - Direct blockchain connection  
✅ **Private Blockchain** - Runs locally, no external network  
✅ **Full Asset Management** - Tokenize, query, and transfer  
✅ **Real-time Updates** - Instant transaction feedback  
✅ **Production-Ready** - Professional UI with error handling  

## 🔐 Security Notes

- This is for **development/testing only**
- Private keys are exposed in Hardhat node output
- **Never** use these accounts on mainnet
- For production, implement proper key management

## 📖 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/v6/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## 🆘 Need Help?

If you encounter issues:
1. Check all terminals for error messages
2. Ensure all dependencies are installed
3. Verify Hardhat node is running
4. Check contract deployment status
5. Review browser console for frontend errors

---

**Happy Tokenizing! 🎉**
