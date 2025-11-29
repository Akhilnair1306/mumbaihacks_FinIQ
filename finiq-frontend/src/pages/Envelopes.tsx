import { Lock, Plus, ArrowDownToLine, Wallet, Shield, TrendingUp, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Envelopes = () => {
  const envelopes = [
    {
      id: 'savings',
      name: 'Savings (Locked)',
      balance: 5200,
      locked: true,
      icon: Lock,
      color: 'from-success to-success/80',
      bgColor: 'bg-success/20'
    },
    {
      id: 'emergency',
      name: 'Emergency Fund',
      balance: 3500,
      locked: false,
      icon: Shield,
      color: 'from-accent to-warning',
      bgColor: 'bg-accent/20'
    },
    {
      id: 'sip',
      name: 'SIP Reserve',
      balance: 1200,
      locked: false,
      icon: TrendingUp,
      color: 'from-secondary to-primary',
      bgColor: 'bg-secondary/20'
    },
    {
      id: 'wants',
      name: 'Wants Bucket',
      balance: 800,
      locked: false,
      icon: ShoppingBag,
      color: 'from-primary to-secondary',
      bgColor: 'bg-primary/20'
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Wallet className="w-7 h-7 text-success" />
          <h1 className="text-3xl font-bold text-foreground">Envelopes & Savings</h1>
        </div>
        <p className="text-muted-foreground">Your money, safely organized</p>
      </header>

      <div className="max-w-5xl space-y-6">
        {/* Total Savings Card */}
        <Card className="shadow-medium rounded-2xl border-0 bg-gradient-to-br from-success/20 to-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Saved</p>
            <div className="flex items-end gap-4">
              <p className="text-5xl font-bold text-foreground">₹10,700</p>
              <p className="text-sm text-success mb-2">↑ ₹500 this week</p>
            </div>
          </CardContent>
        </Card>

        {/* Envelope Cards Grid */}
        <div className="grid grid-cols-2 gap-6">
          {envelopes.map((envelope) => {
            const Icon = envelope.icon;
            return (
              <Card key={envelope.id} className={`shadow-soft rounded-2xl border-0 ${envelope.bgColor}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${envelope.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {envelope.name}
                        {envelope.locked && <Lock className="w-4 h-4 text-success" />}
                      </CardTitle>
                      <p className="text-3xl font-bold text-foreground mt-2">₹{envelope.balance.toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-10">
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 rounded-xl h-10 border-2"
                      disabled={envelope.locked}
                    >
                      <ArrowDownToLine className="w-4 h-4 mr-1" />
                      Withdraw
                    </Button>
                  </div>
                  {envelope.locked && (
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      🔒 Locked for your financial security
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="shadow-soft rounded-2xl border-0 bg-gradient-to-br from-secondary/20 to-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-foreground font-medium mb-2">💡 Smart Tip</p>
            <p className="text-sm text-muted-foreground">
              Your Savings envelope is locked to protect your financial goals. 
              Keep building your emergency fund and SIP reserve for long-term stability.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Envelopes;
