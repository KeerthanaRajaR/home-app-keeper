import { useParams, useNavigate } from 'react-router-dom';
import { mockAppliances } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  Package, 
  Phone, 
  Mail, 
  Globe, 
  MapPin,
  ShieldCheck,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { getWarrantyStatus, calculateWarrantyEndDate, formatWarrantyDate, getDaysUntilExpiry } from '@/utils/warrantyUtils';

export default function ApplianceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const appliance = mockAppliances.find(a => a.id === id);

  if (!appliance) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Appliance Not Found</h2>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const warrantyStatus = getWarrantyStatus(appliance);
  const warrantyEndDate = calculateWarrantyEndDate(appliance.purchaseDate, appliance.warrantyMonths);
  const daysUntilExpiry = getDaysUntilExpiry(appliance);

  const statusConfig = {
    active: { 
      label: 'Active Warranty', 
      className: 'bg-success text-success-foreground',
      icon: ShieldCheck
    },
    expiring: { 
      label: 'Expiring Soon', 
      className: 'bg-warning text-warning-foreground',
      icon: AlertCircle
    },
    expired: { 
      label: 'Warranty Expired', 
      className: 'bg-destructive text-destructive-foreground',
      icon: AlertCircle
    }
  };

  const config = statusConfig[warrantyStatus];
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">{appliance.name}</h1>
                <p className="text-lg text-muted-foreground">{appliance.brand} • {appliance.model}</p>
              </div>
            </div>
            <Badge className={config.className}>
              <StatusIcon className="h-4 w-4 mr-1" />
              {config.label}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <p className="font-medium text-foreground">{appliance.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Serial Number</p>
                    <p className="font-medium text-foreground">{appliance.serialNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Purchase Date</p>
                    <p className="font-medium text-foreground">{formatWarrantyDate(new Date(appliance.purchaseDate))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Purchase Location</p>
                    <p className="font-medium text-foreground">{appliance.purchaseLocation || 'N/A'}</p>
                  </div>
                </div>

                {appliance.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Notes</p>
                      <p className="text-foreground">{appliance.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Maintenance Tasks
                </CardTitle>
                <CardDescription>Scheduled and completed maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                {appliance.maintenanceTasks && appliance.maintenanceTasks.length > 0 ? (
                  <div className="space-y-3">
                    {appliance.maintenanceTasks.map((task) => (
                      <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-foreground">{task.name}</p>
                            {task.completed && (
                              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatWarrantyDate(new Date(task.date))}
                            </span>
                            {task.frequency && (
                              <span className="capitalize">{task.frequency}</span>
                            )}
                          </div>
                          {task.serviceProvider && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Provider: {task.serviceProvider.name}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No maintenance tasks scheduled</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Warranty Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="font-medium text-foreground">{appliance.warrantyMonths} months</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Expires On</p>
                  <p className="font-medium text-foreground">{formatWarrantyDate(warrantyEndDate)}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  {warrantyStatus === 'active' && (
                    <p className="font-medium text-success">{daysUntilExpiry} days remaining</p>
                  )}
                  {warrantyStatus === 'expiring' && (
                    <p className="font-medium text-warning">Expires in {daysUntilExpiry} days</p>
                  )}
                  {warrantyStatus === 'expired' && (
                    <p className="font-medium text-destructive">Expired {Math.abs(daysUntilExpiry)} days ago</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {appliance.supportContact && (
              <Card>
                <CardHeader>
                  <CardTitle>Support Contact</CardTitle>
                  <CardDescription>Customer service information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium text-foreground mb-2">{appliance.supportContact.name}</p>
                  </div>
                  {appliance.supportContact.phone && (
                    <a href={`tel:${appliance.supportContact.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Phone className="h-4 w-4" />
                      {appliance.supportContact.phone}
                    </a>
                  )}
                  {appliance.supportContact.email && (
                    <a href={`mailto:${appliance.supportContact.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Mail className="h-4 w-4" />
                      {appliance.supportContact.email}
                    </a>
                  )}
                  {appliance.supportContact.website && (
                    <a href={appliance.supportContact.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Globe className="h-4 w-4" />
                      Visit Website
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
