import { TrendingUp, Shield, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Investments = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-7 h-7 text-secondary" />
          <h1 className="text-3xl font-bold text-foreground">Smart Investments</h1>
        </div>
        <p className="text-muted-foreground">Grow your money safely</p>
      </header>

      <div className="max-w-5xl space-y-6">
        {/* Top Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Risk Profile Selection */}
          <Card className="shadow-soft rounded-2xl border-0">
            <CardHeader>
              <CardTitle className="text-base">Select Your Risk Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-4 bg-success/20 border-2 border-success rounded-xl text-left transition-all hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">Low Risk</p>
                    <p className="text-sm text-muted-foreground mt-1">Stable returns, minimal volatility</p>
                  </div>
                  <Shield className="w-6 h-6 text-success" />
                </div>
              </button>
              
              <button className="w-full p-4 bg-muted rounded-xl text-left transition-all hover:bg-muted/80">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">Medium Risk</p>
                    <p className="text-sm text-muted-foreground mt-1">Balanced growth with moderate risk</p>
                  </div>
                  <Target className="w-6 h-6 text-secondary" />
                </div>
              </button>
              
              <button className="w-full p-4 bg-muted rounded-xl text-left transition-all hover:bg-muted/80">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">High Risk</p>
                    <p className="text-sm text-muted-foreground mt-1">Higher returns, more volatility</p>
                  </div>
                  <Zap className="w-6 h-6 text-accent" />
                </div>
              </button>
            </CardContent>
          </Card>

          {/* Recommended SIP */}
          <Card className="shadow-soft rounded-2xl border-0 bg-gradient-to-br from-primary/20 to-secondary/20">
            <CardContent className="pt-6 flex flex-col justify-center h-full">
              <p className="text-sm text-muted-foreground mb-2">Recommended Monthly SIP</p>
              <p className="text-5xl font-bold text-foreground mb-4">₹200</p>
              <p className="text-sm text-muted-foreground">Based on your income pattern and risk profile</p>
              <div className="flex gap-3 mt-6">
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12">
                  Add to SIP Reserve
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl h-12 border-2">
                  Top-up SIP
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Options */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="shadow-soft rounded-2xl border-0">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">Index Fund</CardTitle>
                  <Badge className="mt-2 bg-success/20 text-success border-0">Low Risk</Badge>
                </div>
                <Shield className="w-6 h-6 text-success" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Tracks market indices with minimal fees. Safe for beginners.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expected Returns</span>
                <span className="font-bold text-success">10-12% p.a.</span>
              </div>
              <Button className="w-full bg-success hover:bg-success/90 text-success-foreground rounded-xl h-10">
                Start SIP
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-soft rounded-2xl border-0">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">Flexi-cap Fund</CardTitle>
                  <Badge className="mt-2 bg-secondary/20 text-secondary border-0">Medium Risk</Badge>
                </div>
                <Target className="w-6 h-6 text-secondary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Invests across market caps for balanced growth.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expected Returns</span>
                <span className="font-bold text-secondary">12-15% p.a.</span>
              </div>
              <Button variant="outline" className="w-full rounded-xl h-10 border-2">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-soft rounded-2xl border-0">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">Small-cap Allocation</CardTitle>
                  <Badge className="mt-2 bg-accent/20 text-accent border-0">High Risk</Badge>
                </div>
                <Zap className="w-6 h-6 text-accent" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Higher growth potential with increased volatility. Optional add-on.
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expected Returns</span>
                <span className="font-bold text-accent">15-20% p.a.</span>
              </div>
              <Button variant="outline" className="w-full rounded-xl h-10 border-2">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="shadow-soft rounded-2xl border-0 bg-gradient-to-br from-success/20 to-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-foreground font-medium mb-2">💡 Beginner-Friendly Advice</p>
            <p className="text-sm text-muted-foreground">
              Start small and stay consistent. Even ₹200/month can grow significantly over time with the power of compounding!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Investments;
