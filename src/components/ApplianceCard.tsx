import { Appliance } from '@/types/appliance';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getWarrantyStatus, calculateWarrantyEndDate, formatWarrantyDate, getDaysUntilExpiry } from '@/utils/warrantyUtils';
import { Calendar, Package, ArrowRight, Wrench, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ApplianceCardProps {
  appliance: Appliance;
}

export function ApplianceCard({ appliance }: ApplianceCardProps) {
  const navigate = useNavigate();
  const warrantyStatus = getWarrantyStatus(appliance);
  const warrantyEndDate = calculateWarrantyEndDate(appliance.purchaseDate, appliance.warrantyMonths);
  const daysUntilExpiry = getDaysUntilExpiry(appliance);

  const statusConfig = {
    active: { 
      label: 'Active Warranty', 
      variant: 'default' as const, 
      className: 'bg-success text-success-foreground',
      icon: ShieldCheck
    },
    expiring: { 
      label: 'Expiring Soon', 
      variant: 'default' as const, 
      className: 'bg-warning text-warning-foreground',
      icon: Calendar
    },
    expired: { 
      label: 'Expired', 
      variant: 'destructive' as const, 
      className: '',
      icon: Calendar
    }
  };

  const config = statusConfig[warrantyStatus];
  const StatusIcon = config.icon;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden" onClick={() => navigate(`/appliance/${appliance.id}`)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{appliance.name}</h3>
              <p className="text-sm text-muted-foreground">{appliance.brand} • {appliance.model}</p>
            </div>
          </div>
          <Badge className={config.className} variant={config.variant}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Warranty until {formatWarrantyDate(warrantyEndDate)}</span>
          </div>
          
          {/* Days until expiry */}
          {warrantyStatus === 'active' && (
            <div className="text-sm">
              <span className="font-medium text-success">{daysUntilExpiry} days</span> remaining
            </div>
          )}
          {warrantyStatus === 'expiring' && (
            <div className="text-sm">
              <span className="font-medium text-warning">Expires in {daysUntilExpiry} days</span>
            </div>
          )}
          {warrantyStatus === 'expired' && (
            <div className="text-sm">
              <span className="font-medium text-destructive">Expired {Math.abs(daysUntilExpiry)} days ago</span>
            </div>
          )}
          
          {/* Maintenance tasks info */}
          {appliance.maintenanceTasks && appliance.maintenanceTasks.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wrench className="h-4 w-4" />
              <span>
                {appliance.maintenanceTasks.length} maintenance task{appliance.maintenanceTasks.length !== 1 ? 's' : ''}
              </span>
              <span className="text-xs">
                ({appliance.maintenanceTasks.filter(t => t.completed).length} completed)
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">{appliance.category}</span>
            <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              View Details
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}