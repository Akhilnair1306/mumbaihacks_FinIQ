import { Home, PlusCircle, TrendingUp, Wallet, TrendingDown, History, Settings, Sparkles } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const Sidebar = () => {
  const navItems = [
    { to: "/", icon: Home, label: "Dashboard" },
    { to: "/add-transaction", icon: PlusCircle, label: "Add Transaction" },
    { to: "/analysis", icon: TrendingUp, label: "Insights" },
    { to: "/envelopes", icon: Wallet, label: "Savings" },
    { to: "/investments", icon: TrendingDown, label: "Investments" },
    { to: "/history", icon: History, label: "History" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">FINIQ</h1>
            <p className="text-xs text-muted-foreground">AI Financial Companion</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-all"
              activeClassName="bg-primary/10 text-primary font-medium"
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="p-3 bg-gradient-to-br from-success/10 to-primary/10 rounded-xl">
          <p className="text-xs text-foreground font-medium">💡 Quick Tip</p>
          <p className="text-xs text-muted-foreground mt-1">Add transactions daily for best AI insights</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
