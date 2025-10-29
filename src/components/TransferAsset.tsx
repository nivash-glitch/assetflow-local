import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowRightLeft } from "lucide-react";

interface TransferAssetProps {
  onTransfer: (assetId: string, newOwner: string) => Promise<void>;
  isLoading: boolean;
}

export function TransferAsset({ onTransfer, isLoading }: TransferAssetProps) {
  const [assetId, setAssetId] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assetId.trim()) {
      toast.error("Please enter an asset ID");
      return;
    }
    
    if (!newOwner.trim()) {
      toast.error("Please enter new owner address");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(newOwner)) {
      toast.error("Invalid Ethereum address format");
      return;
    }

    await onTransfer(assetId, newOwner);
    
    // Reset form
    setAssetId("");
    setNewOwner("");
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border-border backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ArrowRightLeft className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Transfer Asset</CardTitle>
            <CardDescription>Transfer ownership of a tokenized asset</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="transferAssetId">Asset ID</Label>
            <Input
              id="transferAssetId"
              type="number"
              placeholder="Enter asset ID to transfer"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newOwner">New Owner Address</Label>
            <Input
              id="newOwner"
              placeholder="0x..."
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Must be a valid Ethereum address (starts with 0x)
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-primary/50 transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transferring...
              </>
            ) : (
              "Transfer Asset"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
