# Production Deployment Guide

This guide explains how to deploy your RWA Tokenization DApp to production so it works automatically when published.

## Overview

The app now uses environment variables to configure blockchain connection. This means:
- ✅ No code changes needed for production
- ✅ Works automatically after configuration
- ✅ Secure credential management

---

## Step 1: Choose Your Production Blockchain

You need a blockchain that will be accessible from the internet. Options:

### Option A: Cloud-Hosted Private Network (Recommended for MVP)
Use a service like:
- **AWS/Azure/GCP**: Run Hardhat node or Geth on a cloud server
- **Infura/Alchemy**: Provides dedicated blockchain nodes (supports private networks)
- **QuickNode**: Easy blockchain node hosting

### Option B: Use Existing Testnet (For Testing)
- Ethereum Sepolia Testnet
- Polygon Mumbai Testnet
- Free to use, no hosting required

---

## Step 2: Deploy Your Smart Contract to Production

### For Cloud-Hosted Private Network:

1. **Start your blockchain node on the cloud server**
   ```bash
   # On your cloud server (AWS/Azure/GCP)
   npx hardhat node --hostname 0.0.0.0
   ```

2. **Update hardhat.config.js to include production network**
   ```javascript
   module.exports = {
     networks: {
       production: {
         url: "http://YOUR_CLOUD_SERVER_IP:8545",
         accounts: ["YOUR_PRIVATE_KEY_HERE"]
       }
     }
   };
   ```

3. **Deploy the contract**
   ```bash
   npx hardhat run scripts/deploy.js --network production
   ```

4. **Save the contract address** - It will be printed in the console

### For Testnet (Sepolia):

1. **Get test ETH** from Sepolia faucet (https://sepoliafaucet.com/)

2. **Update hardhat.config.js**
   ```javascript
   module.exports = {
     networks: {
       sepolia: {
         url: "https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY",
         accounts: ["YOUR_PRIVATE_KEY"]
       }
     }
   };
   ```

3. **Deploy**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

---

## Step 3: Configure Environment Variables in Lovable

Now you need to tell your Lovable app where to connect:

### On Desktop:

1. **Open Project Settings**
   - Click your project name in the top-left corner
   - Select **"Settings"** from the dropdown menu

2. **Navigate to Environment Variables**
   - In the settings panel, look for **"Environment Variables"** or **"Secrets"** tab
   - Click on it

3. **Add Your Variables**
   
   **Variable 1: VITE_BLOCKCHAIN_RPC_URL**
   - Click **"Add Variable"** or **"+"** button
   - Name: `VITE_BLOCKCHAIN_RPC_URL`
   - Value: Your blockchain URL, examples:
     - Cloud server: `http://YOUR_SERVER_IP:8545`
     - Alchemy Sepolia: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`
     - Infura: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
   - Click **"Save"** or **"Add"**

   **Variable 2: VITE_CONTRACT_ADDRESS**
   - Click **"Add Variable"** or **"+"** button again
   - Name: `VITE_CONTRACT_ADDRESS`
   - Value: The contract address from Step 2 (starts with 0x...)
   - Click **"Save"** or **"Add"**

### On Mobile:

1. **Open Project Settings**
   - Tap your project name at the top
   - Tap **"Settings"**

2. **Navigate to Environment Variables**
   - Scroll down to find **"Environment Variables"** or **"Secrets"**
   - Tap on it

3. **Add the same variables as desktop** (see above)

---

## Step 4: Publish Your App

### On Desktop:
1. Click the **"Publish"** button in the top-right corner (looks like a web/globe icon)
2. Wait for the build to complete
3. Your app will be live at `yourapp.lovable.app`

### On Mobile:
1. Switch to **Preview mode** (toggle at bottom center of screen)
2. Click the **publish button** in the bottom-right corner
3. Wait for deployment

---

## Step 5: Test Your Production App

1. Visit your published URL (e.g., `yourapp.lovable.app`)
2. The app should automatically connect to your production blockchain
3. Check the **Connection Status** card - it should show "Connected"
4. The network URL should display your production RPC URL
5. Try tokenizing an asset to verify everything works

---

## Troubleshooting

### ❌ "Blockchain Not Connected" error

**Check:**
- ✅ Is your blockchain node running and accessible from the internet?
- ✅ Are the environment variables set correctly in Lovable settings?
- ✅ Is the RPC URL publicly accessible (not localhost)?
- ✅ Does the contract address match the deployed contract?

**Test your RPC URL:**
```bash
curl -X POST YOUR_RPC_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

### ❌ "Contract not initialized" error

**Check:**
- ✅ Is the contract address correct in environment variables?
- ✅ Did the contract deploy successfully?
- ✅ Is the contract on the same network as your RPC URL?

### ❌ Transaction failures

**Check:**
- ✅ Does the signer account have enough ETH for gas fees?
- ✅ Is the blockchain node running and synced?
- ✅ Check browser console for detailed error messages

---

## Security Notes

⚠️ **Important:**
- Never commit private keys to your code
- Always use environment variables for sensitive data
- For production, consider using a proper key management system
- If using a private network, secure it with firewall rules
- Consider implementing authentication for your DApp

---

## Cost Considerations

### Cloud-Hosted Private Network:
- Server hosting: ~$20-50/month (AWS t3.medium or similar)
- Data transfer: Minimal for low traffic
- No gas fees (your private network)

### Public Testnet:
- Free to use
- Test ETH is free from faucets
- Good for MVP/demo

### Public Mainnet (Future):
- Real ETH required for gas fees
- Consider Layer 2 solutions (Polygon, Optimism) for lower costs

---

## Next Steps

Once your production app is working:

1. **Add Custom Domain** (Lovable Pro feature)
   - Project Settings → Domains → Add custom domain

2. **Monitor Your Blockchain**
   - Set up logging and monitoring for your node
   - Track transaction volume and performance

3. **Scale When Needed**
   - Add load balancing for multiple nodes
   - Consider redundancy and backups
   - Implement caching strategies

---

## Need Help?

- Check browser console for detailed errors
- Review Hardhat logs on your server
- Verify environment variables are set correctly
- Test RPC connection independently before debugging app
