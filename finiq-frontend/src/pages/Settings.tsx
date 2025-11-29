import { User, DollarSign, Calendar, Globe, Target, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-7 h-7 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>
        <p className="text-muted-foreground">Customize your FINIQ experience</p>
      </header>

      <div className="max-w-4xl space-y-6">
        {/* Two Column Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card className="shadow-soft rounded-2xl border-0">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Name</label>
                <Input defaultValue="Rajesh" className="rounded-xl border-2" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Phone Number</label>
                <Input defaultValue="+91 98765 43210" className="rounded-xl border-2" />
              </div>
            </CardContent>
          </Card>

          {/* Income Settings */}
          <Card className="shadow-soft rounded-2xl border-0">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-success" />
                Income Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Estimated Daily Earnings</label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">₹</span>
                  <Input type="number" defaultValue="700" className="rounded-xl border-2" />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Working Days per Month</label>
                <Input type="number" defaultValue="26" className="rounded-xl border-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Weekly Cycle */}
          <Card className="shadow-soft rounded-2xl border-0">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                Weekly Cycle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="text-sm text-muted-foreground mb-2 block">Weekly Check Day</label>
              <Select defaultValue="monday">
                <SelectTrigger className="rounded-xl border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Day when your weekly budget analysis will be performed
              </p>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="shadow-soft rounded-2xl border-0">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="text-sm text-muted-foreground mb-2 block">Language</label>
              <Select defaultValue="english">
                <SelectTrigger className="rounded-xl border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                  <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                  <SelectItem value="kannada">ಕನ್ನಡ (Kannada)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Risk Profile - Full Width */}
        <Card className="shadow-soft rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Investment Risk Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select defaultValue="low">
              <SelectTrigger className="rounded-xl border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Risk - Stable returns</SelectItem>
                <SelectItem value="medium">Medium Risk - Balanced growth</SelectItem>
                <SelectItem value="high">High Risk - Higher returns</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-soft rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">Weekly Insights</p>
                <p className="text-xs text-muted-foreground">Get AI-powered spending insights</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">Daily Reminders</p>
                <p className="text-xs text-muted-foreground">Remind to log daily transactions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">Budget Alerts</p>
                <p className="text-xs text-muted-foreground">Alert when nearing budget limits</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">Savings Milestones</p>
                <p className="text-xs text-muted-foreground">Celebrate savings achievements</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg text-lg font-semibold">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
