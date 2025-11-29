// src/pages/Analysis.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LOCAL_KEY = "my_app_transactions_v1";
const SAVINGS_KEY = "my_app_savings_v1";

const toYMD = (d: string | Date) => {
  const dt = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dt.getTime())) return "";
  return dt.toISOString().split("T")[0];
};

const groupByDay = (txns: any[]) => {
  const map: Record<string, any[]> = {};
  txns.forEach(t => {
    const day = toYMD(t.date);
    map[day] = map[day] || [];
    map[day].push(t);
  });
  return map;
};

const groupByWeekLabel = (txns: any[]) => {
  const map: Record<string, any[]> = {};
  txns.forEach(t => {
    const dt = new Date(t.date);
    const diff = (dt.getDay() + 6) % 7; // days since Monday
    const monday = new Date(dt);
    monday.setDate(dt.getDate() - diff);
    const label = `Week ${monday.toISOString().split("T")[0]}`;
    map[label] = map[label] || [];
    map[label].push(t);
  });
  return map;
};

const groupByMonthLabel = (txns: any[]) => {
  const map: Record<string, any[]> = {};
  txns.forEach(t => {
    const dt = new Date(t.date);
    if (isNaN(dt.getTime())) return;
    const label = dt.toLocaleString(undefined, { year: "numeric", month: "long" }); // e.g., "November 2025"
    map[label] = map[label] || [];
    map[label].push(t);
  });
  return map;
};

// Map transactions of a period into the four buckets we want to display
const periodBuckets = (arr: any[]) => {
  const buckets = { essentials: 0, bills: 0, savings: 0, fun: 0 };
  arr.forEach((t) => {
    const cat = (t.category || "").toLowerCase();
    if (["bills", "bill", "utilities"].includes(cat)) buckets.bills += t.amount || 0;
    else if (["saving", "savings"].includes(cat)) buckets.savings += t.amount || 0;
    else if (["wants", "entertainment", "fun", "leisure"].includes(cat)) buckets.fun += t.amount || 0;
    else buckets.essentials += t.amount || 0;
  });
  return buckets;
};

export default function Analysis() {
  const navigate = useNavigate();
  const [txns, setTxns] = useState<any[]>([]);
  const [savings, setSavings] = useState<number>(() => Number(localStorage.getItem(SAVINGS_KEY) || "0"));
  const [view, setView] = useState<"daily"|"weekly"|"monthly">("daily");

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      try { setTxns(JSON.parse(raw)); }
      catch { setTxns([]); }
    } else setTxns([]);
  }, []);

  // Compute period groups and summaries depending on view
  const periods = useMemo(() => {
    if (!txns || txns.length === 0) return [];

    if (view === "daily") {
      const byDay = groupByDay(txns);
      const labels = Object.keys(byDay).sort().reverse(); // newest first
      return labels.map(lbl => {
        const arr = byDay[lbl];
        const income = arr.filter(a => a.type === "earning").reduce((s,a)=> s + (a.amount||0),0);
        const expense = arr.filter(a => a.type === "expense").reduce((s,a)=> s + (a.amount||0),0);
        const buckets = periodBuckets(arr);
        const net = income - expense;
        return { id: lbl, label: lbl, income, expense, savings: Math.max(0, net), net, buckets };
      });
    }

    if (view === "weekly") {
      const byWeek = groupByWeekLabel(txns);
      const labels = Object.keys(byWeek).sort().reverse(); // newest first
      return labels.map(lbl => {
        const arr = byWeek[lbl];
        const income = arr.filter(a => a.type === "earning").reduce((s,a)=> s + (a.amount||0),0);
        const expense = arr.filter(a => a.type === "expense").reduce((s,a)=> s + (a.amount||0),0);
        const buckets = periodBuckets(arr);
        const net = income - expense;
        return { id: lbl, label: lbl, income, expense, savings: Math.max(0, net), net, buckets };
      });
    }

    // monthly
    const byMonth = groupByMonthLabel(txns);
    const labels = Object.keys(byMonth).sort((a,b) => {
      // sort by real month/date: parse the first day of month from label back to date
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    });
    return labels.map(lbl => {
      const arr = byMonth[lbl];
      const income = arr.filter(a => a.type === "earning").reduce((s,a)=> s + (a.amount||0),0);
      const expense = arr.filter(a => a.type === "expense").reduce((s,a)=> s + (a.amount||0),0);
      const buckets = periodBuckets(arr);
      const net = income - expense;
      return { id: lbl, label: lbl, income, expense, savings: Math.max(0, net), net, buckets };
    });
  }, [txns, view]);

  const totalIncome = txns.filter(t=>t.type==='earning').reduce((s,t)=>s+(t.amount||0),0);
  const totalExpense = txns.filter(t=>t.type==='expense').reduce((s,t)=>s+(t.amount||0),0);

  // Small helpers for status and badges
  const statusForNet = (n: number) => {
    if (n > 1000) return { label: `+₹${n}`, badge: "Excellent", color: "text-green-600", bg: "bg-green-50" };
    if (n > 0) return { label: `+₹${n}`, badge: "Good", color: "text-green-500", bg: "bg-green-50" };
    if (n === 0) return { label: `₹0`, badge: "Even", color: "text-gray-600", bg: "bg-gray-50" };
    return { label: `-₹${Math.abs(n)}`, badge: "Overspent", color: "text-rose-500", bg: "bg-rose-50" };
  };

  const moveToSavings = (amount:number) => {
    const newS = savings + amount;
    setSavings(newS);
    localStorage.setItem(SAVINGS_KEY, String(newS));
    alert(`₹${amount} moved to Savings (demo)`);
  };
  const payDebt = (amount:number) => {
    const newS = Math.max(0, savings - amount);
    setSavings(newS);
    localStorage.setItem(SAVINGS_KEY, String(newS));
    alert(`Paid ₹${amount} from Savings (demo)`);
  };

  return (
    <div
      className="min-h-screen bg-background p-8"
      /* explicit font-family to ensure Inter is used even without global CSS */
      style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Analysis</h1>
            <p className="text-lg text-muted-foreground">Daily / Weekly / Monthly insights</p>
          </div>
          <div className="flex gap-2">
            <Button className="text-base" variant={view === "daily" ? undefined : "ghost"} onClick={() => setView("daily")}>Daily</Button>
            <Button className="text-base" variant={view === "weekly" ? undefined : "ghost"} onClick={() => setView("weekly")}>Weekly</Button>
            <Button className="text-base" variant={view === "monthly" ? undefined : "ghost"} onClick={() => setView("monthly")}>Monthly</Button>
            <Button className="text-base" variant="outline" onClick={() => navigate("/")}>Back</Button>
          </div>
        </div>

        {/* Summary top row */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 bg-white rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-base text-muted-foreground">Total Income</div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600">₹{totalIncome}</div>
            </div>
            <div>
              <div className="text-base text-muted-foreground">Total Expense</div>
              <div className="text-3xl md:text-4xl font-bold text-rose-500">₹{totalExpense}</div>
            </div>
            <div>
              <div className="text-base text-muted-foreground">Net Savings</div>
              <div className={`text-3xl md:text-4xl font-bold ${totalIncome - totalExpense >=0 ? "text-emerald-600" : "text-rose-500"}`}>₹{totalIncome - totalExpense}</div>
            </div>
            <div>
              <Button className="text-base" onClick={() => alert("Download (demo)")}>Download Report</Button>
            </div>
          </div>

          <div className="col-span-4 bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-base text-muted-foreground">Savings (store)</div>
            <div className="text-3xl md:text-4xl font-bold">₹{savings}</div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" className="text-base" onClick={() => moveToSavings(500)}>Quick Save ₹500</Button>
              <Button size="sm" className="text-base" variant="outline" onClick={() => {
                const amt = prompt("Amount to pay for debt (demo)");
                if (!amt) return;
                const n = Number(amt);
                if (!n || n <=0) return alert("Invalid");
                if (n > savings) return alert("Not enough savings");
                payDebt(n);
              }}>Pay Debt</Button>
            </div>
          </div>
        </div>

        {/* Period cards: 2-column grid */}
        <div className="grid grid-cols-2 gap-6">
          {periods.map((p) => {
            const st = statusForNet(p.net);
            const buckets = p.buckets || { essentials:0, bills:0, savings:0, fun:0 };
            const totalBucket = Object.values(buckets).reduce((s:any,v:any)=>s+v,0) || 1;
            return (
              <Card key={p.id} className="relative shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-base text-muted-foreground">{view === "daily" ? "Date" : view === "weekly" ? "Period" : "Month"}</div>
                      <div className="text-xl md:text-2xl font-semibold">{p.label}</div>
                      <div className="mt-2 inline-flex items-center gap-2 text-sm md:text-base px-3 py-1 rounded-full" style={{ background: st.bg }}>
                        <span className="text-muted-foreground">{st.badge}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-2xl md:text-3xl font-bold ${p.net >= 0 ? "text-emerald-600" : "text-rose-500"}`}>{st.label}</div>
                      <div className="text-sm md:text-base text-muted-foreground mt-1">{p.income > 0 ? `Income ₹${p.income}` : ""}</div>
                    </div>
                  </div>

                  {/* Income / Expense / Savings row */}
                  <div className="grid grid-cols-3 text-center gap-4 mt-6">
                    <div>
                      <div className="text-base md:text-lg font-semibold text-emerald-600">₹{p.income}</div>
                      <div className="text-sm md:text-base text-muted-foreground">Income</div>
                    </div>
                    <div>
                      <div className="text-base md:text-lg font-semibold text-rose-500">₹{p.expense}</div>
                      <div className="text-sm md:text-base text-muted-foreground">Expense</div>
                    </div>
                    <div>
                      <div className="text-base md:text-lg font-semibold text-sky-600">₹{p.savings}</div>
                      <div className="text-sm md:text-base text-muted-foreground">Savings</div>
                    </div>
                  </div>

                  {/* stacked bucket bar */}
                  <div className="mt-6">
                    <div className="flex h-5 md:h-6 rounded-full overflow-hidden bg-slate-100">
                      <div style={{ width: `${(buckets.essentials/totalBucket)*100}%` }} className="h-full bg-[#e6eef7]" title={`Essentials ${buckets.essentials}`}/>
                      <div style={{ width: `${(buckets.bills/totalBucket)*100}%` }} className="h-full bg-[#feecee]" title={`Bills ${buckets.bills}`}/>
                      <div style={{ width: `${(buckets.savings/totalBucket)*100}%` }} className="h-full bg-[#e6f6ec]" title={`Savings ${buckets.savings}`}/>
                      <div style={{ width: `${(buckets.fun/totalBucket)*100}%` }} className="h-full bg-[#fff4e6]" title={`Fun ${buckets.fun}`}/>
                    </div>

                    <div className="flex justify-between items-center mt-3 text-sm md:text-base text-muted-foreground">
                      <div className="flex items-center gap-2"><span style={{width:12,height:12,background:"#e6eef7",display:"inline-block",borderRadius:3}}/> <span>Essentials</span> <span className="ml-1 font-medium text-slate-700">{buckets.essentials ? `₹${buckets.essentials}` : "₹0"}</span></div>
                      <div className="flex items-center gap-2"><span style={{width:12,height:12,background:"#feecee",display:"inline-block",borderRadius:3}}/> <span>Bills</span> <span className="ml-1 font-medium text-slate-700">{buckets.bills ? `₹${buckets.bills}` : "₹0"}</span></div>
                      <div className="flex items-center gap-2"><span style={{width:12,height:12,background:"#e6f6ec",display:"inline-block",borderRadius:3}}/> <span>Savings</span> <span className="ml-1 font-medium text-slate-700">{buckets.savings ? `₹${buckets.savings}` : "₹0"}</span></div>
                      <div className="flex items-center gap-2"><span style={{width:12,height:12,background:"#fff4e6",display:"inline-block",borderRadius:3}}/> <span>Fun</span> <span className="ml-1 font-medium text-slate-700">{buckets.fun ? `₹${buckets.fun}` : "₹0"}</span></div>
                    </div>
                  </div>

                  {/* actions */}
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="text-sm md:text-base" onClick={() => {
                      if (p.net > 0) moveToSavings(Math.round(p.net * 0.5));
                      else alert("No profit to move");
                    }}>Move Part to Savings</Button>
                    <Button size="sm" className="text-sm md:text-base" variant="outline" onClick={() => {
                      const amt = prompt("Amount to pay from savings (demo)");
                      if (!amt) return;
                      const n = Number(amt);
                      if (!n || n <=0) return alert("Invalid");
                      if (n > savings) return alert("Not enough savings");
                      payDebt(n);
                    }}>Pay Debt</Button>
                    <Button size="sm" className="text-sm md:text-base" variant="outline" onClick={() => {
                      if (p.net >= 0) return alert("No deficit to spread");
                      alert("Deficit will be spread across next periods (demo)");
                    }}>Spread Deficit</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* If no periods */}
        {periods.length === 0 && (
          <div className="bg-white p-6 rounded-2xl text-center text-muted-foreground">
            No transactions yet. Add income/expense or upload CSV to see analysis.
          </div>
        )}
      </div>
    </div>
  );
}
