import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Utensils, Car, ShoppingBag, Home as HomeIcon, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const AddTransaction = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "expense";
  const { toast } = useToast();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [note, setNote] = useState("");

  const categories = [
    { id: "food", label: "Food", icon: Utensils },
    { id: "transport", label: "Transport", icon: Car },
    { id: "wants", label: "Wants", icon: ShoppingBag },
    { id: "bills", label: "Bills", icon: HomeIcon },
    { id: "other", label: "Other", icon: MoreHorizontal },
  ];

  const handleSubmit = () => {
    if (!amount) {
      toast({
        title: "Amount required",
        description: "Please enter an amount",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      type,
      amount: Number(amount),
      category: type !== "earning" ? category : undefined,
      note: note || undefined,
      date: new Date().toISOString().split("T")[0],
    };

    toast({
      title: `${type === "earning" ? "Earning" : "Expense"} Added! 🎉`,
      description: `₹${amount} recorded successfully`,
    });

    navigate("/");
  };

  const isEarning = type === "earning";

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isEarning ? "Add Earning" : "Add Expense"}
          </h1>
          <p className="text-muted-foreground">Takes 5 seconds :)</p>
        </div>

        <div className={isEarning ? "grid grid-cols-1 gap-6" : "grid grid-cols-2 gap-6"}>
          {/* Left Column */}
          <div className="space-y-6">
            <Card className="p-6 shadow-soft rounded-2xl border-0">
              <label className="text-sm text-muted-foreground mb-3 block">Amount</label>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-foreground">₹</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-4xl font-bold border-0 shadow-none p-0 h-auto"
                />
              </div>
            </Card>

            <Card className="p-6 shadow-soft rounded-2xl border-0">
              <label className="text-sm text-muted-foreground mb-3 block">Date</label>
              <Input
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="border-2 rounded-xl"
              />
            </Card>

            {/* Note field for earnings */}
            {isEarning && (
              <Card className="p-6 shadow-soft rounded-2xl border-0">
                <label className="text-sm text-muted-foreground mb-3 block">Note (Optional)</label>
                <Input
                  placeholder="Add a note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="border-2 rounded-xl"
                />
              </Card>
            )}

            {/* Buttons Row */}
            <div className={`flex ${isEarning ? "flex-col" : "flex-row"} gap-3`}>
              <Button
                onClick={handleSubmit}
                className={`flex-1 h-14 text-lg font-semibold rounded-2xl shadow-lg ${
                  isEarning
                    ? "bg-success hover:bg-success/90 text-success-foreground"
                    : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                }`}
              >
                {isEarning ? "Add Earning" : "Add Expense"}
              </Button>

              {!isEarning && (
                <>
                  <input
                    id="billImageInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        toast({
                          title: "Bill Uploaded",
                          description: `File: ${file.name}`,
                        });
                      }
                    }}
                  />

                  <Button
                    onClick={() => document.getElementById("billImageInput")?.click()}
                    variant="outline"
                    className="w-full h-14 text-lg font-semibold rounded-2xl shadow-lg border-2  bg-white hover:bg-red-100 text-foreground transition"
                  >
                    📄 Add Bill
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right Column only for Expense */}
          {!isEarning && (
            <div className="space-y-6">
              <Card className="p-6 shadow-soft rounded-2xl border-0">
                <label className="text-sm text-muted-foreground mb-4 block">Category</label>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        type="button"
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                          category === cat.id
                            ? "bg-primary text-primary-foreground shadow-lg scale-105 border-2 border-primary"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-xs font-medium">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6 shadow-soft rounded-2xl border-0">
                <label className="text-sm text-muted-foreground mb-3 block">Note (Optional)</label>
                <Input
                  placeholder="Add a note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="border-2 rounded-xl"
                />
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
