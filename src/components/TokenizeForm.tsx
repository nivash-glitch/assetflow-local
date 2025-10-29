import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Coins } from "lucide-react";

interface TokenizeFormProps {
  onTokenize: (name: string, assetType: string, value: string) => Promise<void>;
  isLoading: boolean;
}

const assetTypes = [
  "Real Estate",
  "Vehicle",
  "Art",
  "Jewelry",
  "Equipment",
  "Intellectual Property",
  "Other"
];

export function TokenizeForm({ onTokenize, isLoading }: TokenizeFormProps) {
  const [name, setName] = useState("");
  const [assetType, setAssetType] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter asset name");
      return;
    }
    
    if (!assetType) {
      toast.error("Please select asset type");
      return;
    }
    
    if (!value || parseFloat(value) <= 0) {
      toast.error("Please enter a valid asset value");
      return;
    }

    await onTokenize(name, assetType, value);
    
    // Reset form
    setName("");
    setAssetType("");
    setValue("");
  };

  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border-border backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Coins className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Tokenize Asset</CardTitle>
            <CardDescription>Create a new digital representation of a real-world asset</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Asset Name</Label>
            <Input
              id="name"
              placeholder="e.g., Luxury Villa Miami Beach"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Asset Type</Label>
            <Select value={assetType} onValueChange={setAssetType} disabled={isLoading}>
              <SelectTrigger className="bg-background/50 border-border">
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                {assetTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Asset Value (USD)</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              placeholder="e.g., 5000000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isLoading}
              className="bg-background/50 border-border"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-primary/50 transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tokenizing...
              </>
            ) : (
              "Tokenize Asset"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
