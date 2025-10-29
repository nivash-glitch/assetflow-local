import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { TokenizeForm } from "@/components/TokenizeForm";
import { QueryAsset } from "@/components/QueryAsset";
import { TransferAsset } from "@/components/TransferAsset";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { toast } from "sonner";
import { Shield, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Import contract ABI and address
// These files are generated after running the deploy script
import contractAddress from "@/contracts/contract-address.json";
import RWAArtifact from "@/contracts/RWA.json";

const Index = () => {
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [blockNumber, setBlockNumber] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeBlockchain();
  }, []);

  const initializeBlockchain = async () => {
    try {
      // Use environment variable or fallback to localhost
      const rpcUrl = import.meta.env.VITE_BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
      const localProvider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Test connection
      const network = await localProvider.getNetwork();
      console.log("Connected to network:", network.name, "Chain ID:", network.chainId, "RPC:", rpcUrl);

      // Get the first account (signer)
      const localSigner = await localProvider.getSigner(0);
      const address = await localSigner.getAddress();
      
      // Get current block number
      const currentBlock = await localProvider.getBlockNumber();

      // Initialize contract - use env variable if available
      const contractAddr = import.meta.env.VITE_CONTRACT_ADDRESS || contractAddress.RWA;
      const rwaContract = new ethers.Contract(
        contractAddr,
        RWAArtifact.abi,
        localSigner
      );

      setProvider(localProvider);
      setSigner(localSigner);
      setContract(rwaContract);
      setAccount(address);
      setBlockNumber(currentBlock);
      setIsConnected(true);

      toast.success("Connected to private blockchain", {
        description: `Account: ${address.slice(0, 6)}...${address.slice(-4)}`
      });

      // Listen for new blocks
      localProvider.on("block", (newBlockNumber) => {
        setBlockNumber(newBlockNumber);
      });

    } catch (error) {
      console.error("Failed to connect to blockchain:", error);
      setIsConnected(false);
      toast.error("Failed to connect to blockchain", {
        description: "Make sure Hardhat node is running on localhost:8545"
      });
    }
  };

  const handleTokenize = async (name: string, assetType: string, value: string) => {
    if (!contract) {
      toast.error("Contract not initialized");
      return;
    }

    setIsLoading(true);
    try {
      // Convert value to wei (for simplicity, treating input as USD and converting to wei equivalent)
      const valueInWei = ethers.parseEther(value);

      const tx = await contract.tokenizeAsset(name, assetType, valueInWei);
      
      toast.info("Transaction submitted", {
        description: "Waiting for confirmation..."
      });

      const receipt = await tx.wait();
      
      // Extract asset ID from event
      const event = receipt.logs.find((log: any) => {
        try {
          return contract.interface.parseLog(log)?.name === "AssetTokenized";
        } catch {
          return false;
        }
      });

      let assetId = "N/A";
      if (event) {
        const parsedLog = contract.interface.parseLog(event);
        assetId = parsedLog?.args[0].toString();
      }

      toast.success("Asset tokenized successfully!", {
        description: `Asset ID: ${assetId}`
      });

    } catch (error: any) {
      console.error("Tokenization error:", error);
      toast.error("Failed to tokenize asset", {
        description: error.reason || error.message || "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuery = async (assetId: string) => {
    if (!contract) {
      toast.error("Contract not initialized");
      return null;
    }

    setIsLoading(true);
    try {
      const result = await contract.getAsset(assetId);
      
      const asset = {
        id: result[0].toString(),
        name: result[1],
        assetType: result[2],
        value: ethers.formatEther(result[3]),
        owner: result[4],
        timestamp: result[5].toString()
      };

      toast.success("Asset retrieved successfully");
      return asset;

    } catch (error: any) {
      console.error("Query error:", error);
      toast.error("Failed to query asset", {
        description: error.reason || "Asset may not exist"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = async (assetId: string, newOwner: string) => {
    if (!contract) {
      toast.error("Contract not initialized");
      return;
    }

    setIsLoading(true);
    try {
      const tx = await contract.transferAsset(assetId, newOwner);
      
      toast.info("Transaction submitted", {
        description: "Waiting for confirmation..."
      });

      await tx.wait();

      toast.success("Asset transferred successfully!", {
        description: `Asset #${assetId} transferred to ${newOwner.slice(0, 6)}...${newOwner.slice(-4)}`
      });

    } catch (error: any) {
      console.error("Transfer error:", error);
      toast.error("Failed to transfer asset", {
        description: error.reason || error.message || "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-primary/60 rounded-lg shadow-lg">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  RWA Tokenization
                </h1>
                <p className="text-sm text-muted-foreground">Real-World Asset DApp • Private Blockchain</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Setup Alert */}
        {!isConnected && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Blockchain Not Connected</AlertTitle>
            <AlertDescription>
              Make sure you have:
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Started Hardhat node: <code className="bg-background/50 px-2 py-1 rounded">npx hardhat node</code></li>
                <li>Deployed contract: <code className="bg-background/50 px-2 py-1 rounded">npx hardhat run scripts/deploy.js --network localhost</code></li>
              </ol>
              <p className="mt-2">See <code className="bg-background/50 px-2 py-1 rounded">BLOCKCHAIN_SETUP.md</code> for detailed instructions.</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Connection Status */}
        <div className="mb-8">
          <ConnectionStatus 
            isConnected={isConnected}
            blockNumber={blockNumber}
            account={account}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tokenize Asset */}
          <TokenizeForm onTokenize={handleTokenize} isLoading={isLoading} />

          {/* Query Asset */}
          <QueryAsset onQuery={handleQuery} isLoading={isLoading} />

          {/* Transfer Asset */}
          <div className="lg:col-span-2">
            <TransferAsset onTransfer={handleTransfer} isLoading={isLoading} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            🔒 Running on private blockchain • No external wallets required
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
