import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, FileText, Users, BarChart3, 
  Settings, LogOut, Menu, X, Plus, Search,
  Edit, Trash2, Eye, ToggleLeft, ToggleRight, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { getAdminSchemes } from '@/services/api';
import { Scheme } from '@/types/scheme';
import { useToast } from '@/hooks/use-toast';

const AdminSchemesPage = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [dialogType, setDialogType] = useState<'view' | 'edit' | 'delete' | null>(null);
  const { toast } = useToast();

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

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard', active: false },
    { label: 'Manage Schemes', icon: FileText, path: '/admin/schemes', active: true },
    { label: 'Users', icon: Users, path: '/admin/users', active: false },
    { label: 'Analytics', icon: BarChart3, path: '/admin/analytics', active: false },
    { label: 'Settings', icon: Settings, path: '/admin/settings', active: false },
  ];

  const filteredSchemes = schemes.filter(scheme =>
    scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scheme.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (scheme: Scheme, action: 'view' | 'edit' | 'delete') => {
    setSelectedScheme(scheme);
    setDialogType(action);
  };

  const handleConfirmDelete = () => {
    toast({
      title: 'Feature Not Implemented',
      description: 'Delete functionality will be available when backend is connected.',
    });
    setDialogType(null);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        className={`fixed lg:relative z-40 w-64 h-screen bg-card border-r border-border flex flex-col ${sidebarOpen ? '' : 'lg:-ml-64'}`}
      >
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
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="font-heading text-xl font-semibold text-foreground">
              Manage Schemes
            </h1>
          </div>

          <Button variant="government" className="gap-2">
            <Plus className="w-4 h-4" /> Add Scheme
          </Button>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {/* Filters */}
          <div className="bg-card rounded-xl border border-border p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search schemes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" /> Filters
              </Button>
            </div>
          </div>

          {/* Schemes Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scheme Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        Loading schemes...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredSchemes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No schemes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSchemes.map((scheme, idx) => (
                    <motion.tr
                      key={scheme.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{scheme.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-xs">
                            {scheme.ministry}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{scheme.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={scheme.type === 'Central' ? 'default' : 'secondary'}>
                          {scheme.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ToggleRight className="w-5 h-5 text-success" />
                          <span className="text-sm text-success">Active</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAction(scheme, 'view')}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAction(scheme, 'edit')}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleAction(scheme, 'delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Info Banner */}
          <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Note:</span> This is a UI-only admin panel. 
              Add, Edit, and Delete operations will be functional when connected to a backend API.
            </p>
          </div>
        </main>
      </div>

      {/* View Dialog */}
      <Dialog open={dialogType === 'view'} onOpenChange={() => setDialogType(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedScheme?.name}</DialogTitle>
            <DialogDescription>{selectedScheme?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-medium text-foreground">{selectedScheme?.category}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-medium text-foreground">{selectedScheme?.type}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Ministry</p>
                <p className="font-medium text-foreground">{selectedScheme?.ministry}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Launch Year</p>
                <p className="font-medium text-foreground">{selectedScheme?.launchYear}</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-2">Eligibility Rules</p>
              <pre className="text-xs text-foreground overflow-x-auto">
                {JSON.stringify(selectedScheme?.eligibility, null, 2)}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={dialogType === 'edit'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Scheme</DialogTitle>
            <DialogDescription>
              Edit functionality will be available when backend is connected.
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center text-muted-foreground">
            <Edit className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>Editing "{selectedScheme?.name}"</p>
            <p className="text-sm mt-2">Form fields will appear here when implemented.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
            <Button variant="government" disabled>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={dialogType === 'delete'} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scheme</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedScheme?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete Scheme</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSchemesPage;
