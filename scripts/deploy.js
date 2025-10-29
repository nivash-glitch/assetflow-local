const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting RWA contract deployment...\n");

  // Get the contract factory
  const RWA = await hre.ethers.getContractFactory("RWA");
  
  // Deploy the contract
  console.log("📝 Deploying RWA contract...");
  const rwa = await RWA.deploy();
  
  await rwa.waitForDeployment();
  const contractAddress = await rwa.getAddress();

  console.log("✅ RWA contract deployed to:", contractAddress);
  console.log("⛓️  Network:", hre.network.name);
  console.log("🔗 Chain ID:", hre.network.config.chainId);

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deployed by:", deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Save contract address and ABI to frontend
  const contractsDir = path.join(__dirname, "..", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract address
  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ RWA: contractAddress }, null, 2)
  );

  // Save contract ABI
  const RWAArtifact = await hre.artifacts.readArtifact("RWA");
  fs.writeFileSync(
    path.join(contractsDir, "RWA.json"),
    JSON.stringify(RWAArtifact, null, 2)
  );

  console.log("📁 Contract address and ABI saved to src/contracts/");
  console.log("✨ Deployment complete!\n");
  console.log("📋 Next steps:");
  console.log("   1. Keep this Hardhat node running");
  console.log("   2. Open a new terminal and run: npm run dev");
  console.log("   3. Visit http://localhost:8080 to use the DApp\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
