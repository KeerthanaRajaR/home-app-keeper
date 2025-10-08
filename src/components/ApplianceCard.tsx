import { Appliance } from '@/types/appliance';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getWarrantyStatus, calculateWarrantyEndDate, formatWarrantyDate } from '@/utils/warrantyUtils';
import { Calendar, Package, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ApplianceCardProps {
  appliance: Appliance;
}

export function ApplianceCard({ appliance }: ApplianceCardProps) {
  const navigate = useNavigate();
  const warrantyStatus = getWarrantyStatus(appliance);
  const warrantyEndDate = calculateWarrantyEndDate(appliance.purchaseDate, appliance.warrantyMonths);

  const statusConfig = {
    active: { label: 'Active Warranty', variant: 'default' as const, className: 'bg-success text-success-foreground' },
    expiring: { label: 'Expiring Soon', variant: 'default' as const, className: 'bg-warning text-warning-foreground' },
    expired: { label: 'Expired', variant: 'destructive' as const, className: '' }
  };

  const config = statusConfig[warrantyStatus];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group" onClick={() => navigate(`/appliance/${appliance.id}`)}>
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
