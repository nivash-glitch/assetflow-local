import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Search, Building2, DollarSign, User, Calendar } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  assetType: string;
  value: string;
  owner: string;
  timestamp: string;
}

interface QueryAssetProps {
  onQuery: (assetId: string) => Promise<Asset | null>;
  isLoading: boolean;
}

export function QueryAsset({ onQuery, isLoading }: QueryAssetProps) {
  const [assetId, setAssetId] = useState("");
  const [asset, setAsset] = useState<Asset | null>(null);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assetId.trim()) {
      toast.error("Please enter an asset ID");
      return;
    }

    const result = await onQuery(assetId);
    if (result) {
      setAsset(result);
    } else {
      setAsset(null);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString();
  };

  const formatValue = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border-border backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Query Asset</CardTitle>
            <CardDescription>Retrieve details of a tokenized asset by ID</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleQuery} className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="assetId">Asset ID</Label>
            <Input
              id="assetId"
              type="number"
              placeholder="Enter asset ID (e.g., 1)"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border"
            />
          </div>
          <Button 
            type="submit"
            className="mt-auto bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Query"
            )}
          </Button>
        </form>

        {asset && (
          <div className="bg-background/50 rounded-lg border border-border p-6 space-y-4 animate-in fade-in-50">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{asset.name}</h3>
                <p className="text-sm text-muted-foreground">Asset ID: #{asset.id}</p>
              </div>
              <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                {asset.assetType}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="text-lg font-semibold text-foreground">{formatValue(asset.value)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tokenized</p>
                  <p className="text-lg font-semibold text-foreground">{formatDate(asset.timestamp)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 md:col-span-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Owner Address</p>
                  <p className="text-sm font-mono text-foreground break-all">{asset.owner}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
