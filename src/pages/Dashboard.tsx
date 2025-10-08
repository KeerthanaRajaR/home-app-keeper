import { useState, useMemo } from 'react';
import { ApplianceCard } from '@/components/ApplianceCard';
import { mockAppliances } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { getWarrantyStatus } from '@/utils/warrantyUtils';
import { WarrantyStatus } from '@/types/appliance';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<WarrantyStatus[]>([]);

  const filteredAppliances = useMemo(() => {
    return mockAppliances.filter((appliance) => {
      const matchesSearch = 
        appliance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appliance.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appliance.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(getWarrantyStatus(appliance));

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilters]);

  const toggleStatusFilter = (status: WarrantyStatus) => {
    setStatusFilters(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const stats = useMemo(() => {
    const total = mockAppliances.length;
    const active = mockAppliances.filter(a => getWarrantyStatus(a) === 'active').length;
    const expiring = mockAppliances.filter(a => getWarrantyStatus(a) === 'expiring').length;
    const expired = mockAppliances.filter(a => getWarrantyStatus(a) === 'expired').length;
    return { total, active, expiring, expired };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Appliances</h1>
          <p className="text-muted-foreground">Track and manage your home appliances in one place</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Appliances</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold text-success">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active Warranties</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold text-warning">{stats.expiring}</div>
            <div className="text-sm text-muted-foreground">Expiring Soon</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-2xl font-bold text-destructive">{stats.expired}</div>
            <div className="text-sm text-muted-foreground">Expired</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, brand, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
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
        </div>

        {filteredAppliances.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No appliances found matching your criteria</p>
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
