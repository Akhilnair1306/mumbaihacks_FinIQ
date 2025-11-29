import { Download, TrendingUp, Trophy, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const History = () => {
  const weeks = [
    { week: 1, income: 5200, expense: 4800, savings: 400, status: 'good' },
    { week: 2, income: 4800, expense: 5800, savings: -1000, status: 'overspend' },
    { week: 3, income: 5500, expense: 4200, savings: 1300, status: 'excellent' },
    { week: 4, income: 4500, expense: 5600, savings: -1100, status: 'overspend' },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Month Summary</h1>
        </div>
        <p className="text-muted-foreground">Your financial journey this month</p>
      </header>

      <div className="max-w-5xl space-y-6">
        {/* Total Summary Card */}
        <Card className="shadow-medium rounded-2xl border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-12">
                <div>
                  <p className="text-3xl font-bold text-success">₹20,000</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Income</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-destructive">₹20,400</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Expense</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent">-₹400</p>
                  <p className="text-sm text-muted-foreground mt-1">Net Savings</p>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 px-6">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Breakdown Grid */}
        <div className="grid grid-cols-2 gap-6">
          {weeks.map((week) => (
            <Card key={week.week} className="shadow-soft rounded-2xl border-0">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-foreground">Week {week.week}</p>
                    <Badge className={
                      week.status === 'excellent' ? 'bg-success/20 text-success border-0' :
                      week.status === 'good' ? 'bg-primary/20 text-primary border-0' :
                      'bg-destructive/20 text-destructive border-0'
                    }>
                      {week.status === 'excellent' ? '🏆 Excellent' :
                       week.status === 'good' ? '✓ Good' :
                       '⚠️ Overspent'}
                    </Badge>
                  </div>
                  <p className={`text-2xl font-bold ${
                    week.savings > 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {week.savings > 0 ? '+' : ''}₹{Math.abs(week.savings)}
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-success font-semibold text-lg">₹{week.income}</p>
                    <p className="text-xs text-muted-foreground">Income</p>
                  </div>
                  <div>
                    <p className="text-destructive font-semibold text-lg">₹{week.expense}</p>
                    <p className="text-xs text-muted-foreground">Expense</p>
                  </div>
                  <div>
                    <p className={`font-semibold text-lg ${week.savings > 0 ? 'text-success' : 'text-destructive'}`}>
                      ₹{Math.abs(week.savings)}
                    </p>
                    <p className="text-xs text-muted-foreground">Savings</p>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      week.status === 'excellent' ? 'bg-success' :
                      week.status === 'good' ? 'bg-primary' :
                      'bg-destructive'
                    }`}
                    style={{ width: `${Math.min((week.income - week.expense) / week.income * 100 + 50, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insights Row */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="shadow-soft rounded-2xl border-0 bg-gradient-to-br from-success/20 to-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Trophy className="w-6 h-6 text-success mt-1" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Week 3 was your best savings week!</p>
                  <p className="text-sm text-muted-foreground">You saved ₹1,300 — keep up the momentum</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft rounded-2xl border-0 bg-gradient-to-br from-accent/20 to-warning/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-accent mt-1" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">One-time phone repair caused Week 4 overspend</p>
                  <p className="text-sm text-muted-foreground">Emergency expenses happen — consider building your emergency fund</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default History;
