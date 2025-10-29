import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Database, Wallet } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
  blockNumber: number | null;
  account: string | null;
}

export function ConnectionStatus({ isConnected, blockNumber, account }: ConnectionStatusProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border-border backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <Wifi className="h-5 w-5 text-primary" />
                  <span className="font-medium">Blockchain Status</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-5 w-5 text-destructive" />
                  <span className="font-medium">Blockchain Status</span>
                </>
              )}
            </div>
            <Badge variant={isConnected ? "default" : "destructive"} className="font-semibold">
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Latest Block</p>
                <p className="text-sm font-mono font-semibold text-foreground">
                  {blockNumber !== null ? `#${blockNumber}` : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-border">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Account</p>
                <p className="text-sm font-mono font-semibold text-foreground truncate">
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Network: <span className="font-mono text-foreground">{import.meta.env.VITE_BLOCKCHAIN_RPC_URL || "localhost:8545"}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
