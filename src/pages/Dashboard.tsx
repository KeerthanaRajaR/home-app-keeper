import { useState, useMemo } from 'react';
import { ApplianceCard } from '@/components/ApplianceCard';
import { useAppliances } from '@/contexts/ApplianceContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus, TrendingUp, Calendar, AlertTriangle, Package } from 'lucide-react';
import { getWarrantyStatus } from '@/utils/warrantyUtils';
import { WarrantyStatus } from '@/types/appliance';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';

// ... rest of the existing code remains the same ...
export default function Dashboard() {
  const { appliances, loading, error } = useAppliances();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<WarrantyStatus[]>([]);

  const filteredAppliances = useMemo(() => {
    return appliances.filter((appliance) => {
      const matchesSearch = 
        appliance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appliance.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appliance.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (appliance.serialNumber && appliance.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(getWarrantyStatus(appliance));

      return matchesSearch && matchesStatus;
    });
  }, [appliances, searchQuery, statusFilters]);

  const toggleStatusFilter = (status: WarrantyStatus) => {
    setStatusFilters(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const stats = useMemo(() => {
    const total = appliances.length;
    const active = appliances.filter(a => getWarrantyStatus(a) === 'active').length;
    const expiring = appliances.filter(a => getWarrantyStatus(a) === 'expiring').length;
    const expired = appliances.filter(a => getWarrantyStatus(a) === 'expired').length;
    return { total, active, expiring, expired };
  }, [appliances]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your appliances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold mt-4">Error Loading Appliances</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Appliances</h1>
          <p className="text-muted-foreground">Track and manage your home appliances in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-5 w-5 text-primary" />
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            </div>
            <div className="text-sm text-muted-foreground">Total Appliances</div>
          </div>
          <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <div className="text-2xl font-bold text-success">{stats.active}</div>
            </div>
            <div className="text-sm text-muted-foreground">Active Warranties</div>
          </div>
          <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-warning" />
              <div className="text-2xl font-bold text-warning">{stats.expiring}</div>
            </div>
            <div className="text-sm text-muted-foreground">Expiring Soon</div>
          </div>
          <div className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div className="text-2xl font-bold text-destructive">{stats.expired}</div>
            </div>
            <div className="text-sm text-muted-foreground">Expired</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, brand, category, or serial number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                  {statusFilters.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                      {statusFilters.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuCheckboxItem
                  checked={statusFilters.includes('active')}
                  onCheckedChange={() => toggleStatusFilter('active')}
                >
                  Active Warranty
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilters.includes('expiring')}
                  onCheckedChange={() => toggleStatusFilter('expiring')}
                >
                  Expiring Soon
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilters.includes('expired')}
                  onCheckedChange={() => toggleStatusFilter('expired')}
                >
                  Expired
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/add">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Appliances Grid */}
        {filteredAppliances.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No appliances found</h3>
            <p className="text-muted-foreground mb-6">
              {appliances.length === 0 
                ? "Get started by adding your first appliance" 
                : "Try adjusting your search or filter criteria"}
            </p>
            {appliances.length === 0 && (
              <Link to="/add">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Appliance
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppliances.map((appliance) => (
              <ApplianceCard key={appliance.id} appliance={appliance} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}