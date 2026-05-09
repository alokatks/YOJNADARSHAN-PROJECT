import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, FileText, Users, BarChart3, 
  Settings, LogOut, Bell, Menu, X, Plus,
  TrendingUp, CheckCircle, Clock, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { getAdminSchemes } from '@/services/api';
import { Scheme } from '@/types/scheme';

const AdminDashboard = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const data = await getAdminSchemes();
        setSchemes(data);
      } catch (error) {
        console.error('Error fetching schemes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchemes();
  }, []);

  const stats = [
    { 
      label: 'Total Schemes', 
      value: schemes.length, 
      icon: FileText, 
      color: 'bg-primary/10 text-primary',
      trend: '+12%'
    },
    { 
      label: 'Central Schemes', 
      value: schemes.filter(s => s.type === 'Central').length, 
      icon: CheckCircle, 
      color: 'bg-success/10 text-success',
      trend: '+5%'
    },
    { 
      label: 'State Schemes', 
      value: schemes.filter(s => s.type === 'State').length, 
      icon: TrendingUp, 
      color: 'bg-accent/10 text-accent',
      trend: '+8%'
    },
    { 
      label: 'Active Users', 
      value: '1,234', 
      icon: Users, 
      color: 'bg-warning/10 text-warning',
      trend: '+23%'
    },
  ];

  const recentActivity = [
    { type: 'scheme', action: 'New scheme added', name: 'PM Vishwakarma', time: '2 hours ago' },
    { type: 'user', action: 'User registered', name: 'user@example.com', time: '3 hours ago' },
    { type: 'scheme', action: 'Scheme updated', name: 'PM-KISAN', time: '5 hours ago' },
    { type: 'alert', action: 'Eligibility rules modified', name: 'Ayushman Bharat', time: '1 day ago' },
  ];

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', active: true },
    { label: 'Manage Schemes', icon: FileText, path: '/admin/schemes', active: false },
    { label: 'Users', icon: Users, path: '/admin/users', active: false },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics', active: false },
    { label: 'Settings', icon: Settings, path: '/admin/settings', active: false },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className={`fixed lg:relative z-40 w-64 h-screen bg-card border-r border-border flex flex-col ${sidebarOpen ? '' : 'lg:-ml-64'}`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
              <span className="font-bold text-white text-sm">YD</span>
            </div>
            <div>
              <h2 className="font-heading font-bold text-foreground">Admin</h2>
              <p className="text-xs text-muted-foreground">YojnaDarshan</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                item.active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full justify-start gap-3 text-destructive hover:text-destructive" asChild>
            <Link to="/admin/login">
              <LogOut className="w-4 h-4" /> Sign Out
            </Link>
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="font-heading text-xl font-semibold text-foreground">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
              A
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <AnimatedCard key={stat.label} index={index} hoverEffect="lift">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-success mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {stat.trend} this month
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <AnimatedCard index={4} className="lg:col-span-1">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3" asChild>
                  <Link to="/admin/schemes">
                    <Plus className="w-4 h-4" /> Add New Scheme
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3">
                  <FileText className="w-4 h-4" /> Edit Eligibility Rules
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3">
                  <Users className="w-4 h-4" /> View User Reports
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3">
                  <BarChart3 className="w-4 h-4" /> Export Analytics
                </Button>
              </div>
            </AnimatedCard>

            {/* Recent Activity */}
            <AnimatedCard index={5} className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Recent Activity
                </h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted/80 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'scheme' ? 'bg-primary/10 text-primary' :
                      activity.type === 'user' ? 'bg-success/10 text-success' :
                      'bg-warning/10 text-warning'
                    }`}>
                      {activity.type === 'scheme' ? <FileText className="w-5 h-5" /> :
                       activity.type === 'user' ? <Users className="w-5 h-5" /> :
                       <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.name}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {activity.time}
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedCard>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
