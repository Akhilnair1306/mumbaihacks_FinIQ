// src/pages/Dashboard.tsx
import { useRef, useState, useEffect } from "react";
import { Plus, TrendingUp, TrendingDown, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

/**
 * Simple CSV parser:
 * expects CSV with header: type,category,note,amount,date
 * type: "earning" | "expense"
 * date format: yyyy-mm-dd (or parseable)
 */
const parseCSV = (text: string) => {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  const rows = lines.slice(1);
  const out: any[] = [];

  for (const row of rows) {
    const cols = row.split(",").map(c => c.trim());
    if (cols.length < headers.length) continue;
    const obj: any = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i];
    });
    // normalize types
    const amount = Number(obj.amount || obj["amt"] || 0);
    const type = (obj.type || "expense").toLowerCase();
    out.push({
      type: type === "earning" ? "earning" : "expense",
      category: obj.category || "other",
      note: obj.note || "",
      amount: isNaN(amount) ? 0 : Math.round(amount),
      date: obj.date || new Date().toISOString().split("T")[0],
    });
  }
  return out;
};

const LOCAL_KEY = "my_app_transactions_v1";
const SAVINGS_KEY = "my_app_savings_v1";

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [recentTxns, setRecentTxns] = useState<any[]>([]);
  const [savings, setSavings] = useState<number>(() => Number(localStorage.getItem(SAVINGS_KEY) || "0"));

  // load transactions from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      try {
        setRecentTxns(JSON.parse(raw));
      } catch {
        setRecentTxns([]);
      }
    } else {
      // default demo data if none present
      const demo = [
        { type: "expense", category: "Food", note: "Lunch at local restaurant", amount: 150, date: "2025-11-29" },
        { type: "earning", category: "Delivery", note: "8 orders completed", amount: 650, date: "2025-11-29" },
        { type: "expense", category: "Transport", note: "Petrol refill", amount: 200, date: "2025-11-28" },
        { type: "earning", category: "Ride", note: "12 rides completed", amount: 890, date: "2025-11-28" },
        { type: "expense", category: "Food", note: "Dinner with family", amount: 320, date: "2025-11-27" },
        { type: "earning", category: "Delivery", note: "15 orders completed", amount: 1100, date: "2025-11-27" },
      ];
      localStorage.setItem(LOCAL_KEY, JSON.stringify(demo));
      setRecentTxns(demo);
    }
  }, []);

  const handleCsvClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseCSV(text);
    if (parsed.length === 0) {
      console.warn("No rows parsed from CSV");
      e.currentTarget.value = "";
      return;
    }
    // merge with existing txns
    const merged = [...parsed, ...recentTxns];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(merged));
    setRecentTxns(merged);
    e.currentTarget.value = "";
    // Optionally navigate to analysis
    navigate("/analysis");
  };

  // Quick compute totals for small dashboard cards
  const totalIncome = recentTxns.filter(t => t.type === "earning").reduce((s, t) => s + (t.amount || 0), 0);
  const totalExpense = recentTxns.filter(t => t.type === "expense").reduce((s, t) => s + (t.amount || 0), 0);

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Hidden file input for CSV upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Hello, Rajesh</h1>
        </div>
        <p className="text-muted-foreground">Here's your week overview</p>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Quick Add Buttons (3 columns) */}
          <div className="grid grid-cols-3 gap-4">
            <Button
              onClick={() => navigate("/add-transaction?type=earning")}
              className="h-32 bg-success hover:bg-success/90 text-success-foreground shadow-soft rounded-2xl text-lg font-semibold"
            >
              <div className="flex flex-col items-center gap-3">
                <Plus className="w-8 h-8" />
                <span>Add Earning</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate("/add-transaction?type=expense")}
              className="h-32 bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-soft rounded-2xl text-lg font-semibold"
            >
              <div className="flex flex-col items-center gap-3">
                <Plus className="w-8 h-8" />
                <span>Add Expense</span>
              </div>
            </Button>

            {/* Add CSV button opens native file selector */}
            <Button
              onClick={handleCsvClick}
              className="h-32 bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft rounded-2xl text-lg font-semibold"
            >
              <div className="flex flex-col items-center gap-3">
                <Plus className="w-8 h-8" />
                <span>Add CSV</span>
              </div>
            </Button>
          </div>

          {/* Projections Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Monthly Projection Card */}
            <Card className="shadow-soft rounded-2xl border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Monthly Projection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Projected Income</span>
                    <span className="font-bold text-foreground">₹20,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Actual so far</span>
                    <span className="font-bold text-success">₹{totalIncome}</span>
                  </div>
                  <Progress value={Math.min(100, Math.round((totalIncome / 20000) * 100))} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">{Math.round((totalIncome / 20000) * 100)}% of monthly goal reached</p>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Budget Card */}
            <Card className="shadow-soft rounded-2xl border-0">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">Weekly Budget</CardTitle>
                  <Badge className="bg-success/20 text-success hover:bg-success/30 border-0">On Track</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">₹5,000</p>
                    <p className="text-xs text-muted-foreground">Budget</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-destructive">₹{totalExpense}</p>
                    <p className="text-xs text-muted-foreground">Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-success">₹{Math.max(0, 5000 - totalExpense)}</p>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                  </div>
                </div>
                <Progress value={Math.min(100, Math.round((totalExpense / 5000) * 100))} className="h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Analysis Card (replaces AI Insight) */}
          <Card className="shadow-medium rounded-2xl border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-accent" />
                Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground">
                Get Daily / Weekly / Monthly insights, suggestions and quick actions.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => navigate("/analysis")} size="sm" variant="outline" className="rounded-full border-2">
                  Go to Analysis
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-2"
                  onClick={() => {
                    // Quick demo: move some funds to savings from local storage (simulated)
                    const newSavings = savings + 500;
                    setSavings(newSavings);
                    localStorage.setItem(SAVINGS_KEY, String(newSavings));
                    alert("₹500 moved to Savings (demo)");
                  }}
                >
                  Quick Save ₹500
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => navigate("/investments")} variant="outline" className="h-20 rounded-2xl border-2 text-base font-medium">
              View Investments
            </Button>
            <Button onClick={() => navigate("/Analysis")} variant="outline" className="h-20 rounded-2xl border-2 text-base font-medium">
              Insights
            </Button>
          </div>
        </div>

        {/* Right Column - Recent Transactions */}
        <div className="space-y-6">
          <Card className="shadow-soft rounded-2xl border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTxns.slice(0, 12).map((txn: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${txn.type === "earning" ? "bg-success/20" : "bg-destructive/20"}`}>
                      {txn.type === "earning" ? <TrendingUp className="w-4 h-4 text-success" /> : <TrendingDown className="w-4 h-4 text-destructive" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{txn.note}</p>
                      <p className="text-xs text-muted-foreground">{txn.category} • {txn.date}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-sm ${txn.type === "earning" ? "text-success" : "text-destructive"}`}>
                    {txn.type === "earning" ? "+" : "-"}₹{txn.amount}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
