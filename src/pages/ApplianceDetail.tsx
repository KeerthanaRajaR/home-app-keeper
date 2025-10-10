import { useParams, useNavigate } from 'react-router-dom';
import { useAppliances } from '@/contexts/ApplianceContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  AlertCircle,
  Plus,
  CheckCircle,
  Clock
} from 'lucide-react';
import { getWarrantyStatus, calculateWarrantyEndDate, formatWarrantyDate, getDaysUntilExpiry } from '@/utils/warrantyUtils';
import { useState } from 'react';

export default function ApplianceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAppliance, updateAppliance } = useAppliances();
  const appliance = id ? getAppliance(id) : undefined;

  // Maintenance task form state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    name: '',
    date: '',
    frequency: 'once',
    notes: '',
    serviceProviderName: '',
    serviceProviderPhone: '',
    serviceProviderEmail: ''
  });

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

  // Generate a simple ID without uuid package
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  // Handle maintenance task form changes
  const handleTaskFormChange = (field: string, value: string) => {
    setTaskForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle adding a new maintenance task
  const handleAddTask = () => {
    if (!taskForm.name || !taskForm.date) {
      alert('Please fill in required fields');
      return;
    }

    const newTask = {
      id: generateId(),
      name: taskForm.name,
      date: taskForm.date,
      frequency: taskForm.frequency as 'once' | 'monthly' | 'quarterly' | 'yearly',
      completed: false,
      notes: taskForm.notes || undefined,
      serviceProvider: (taskForm.serviceProviderName || taskForm.serviceProviderPhone || taskForm.serviceProviderEmail) ? {
        name: taskForm.serviceProviderName,
        phone: taskForm.serviceProviderPhone || undefined,
        email: taskForm.serviceProviderEmail || undefined
      } : undefined
    };

    // Update appliance with new task
    updateAppliance(appliance.id, {
      maintenanceTasks: [...(appliance.maintenanceTasks || []), newTask]
    });

    // Reset form and hide
    setTaskForm({
      name: '',
      date: '',
      frequency: 'once',
      notes: '',
      serviceProviderName: '',
      serviceProviderPhone: '',
      serviceProviderEmail: ''
    });
    setShowTaskForm(false);
  };

  // Handle task completion toggle
  const toggleTaskCompletion = (taskId: string) => {
    if (!appliance.maintenanceTasks) return;
    
    const updatedTasks = appliance.maintenanceTasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    updateAppliance(appliance.id, { maintenanceTasks: updatedTasks });
  };

  // ... rest of the existing code remains the same ...

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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Maintenance Tasks
                    </CardTitle>
                    <CardDescription>Scheduled and completed maintenance</CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    className="gap-1"
                    onClick={() => setShowTaskForm(!showTaskForm)}
                  >
                    <Plus className="h-4 w-4" />
                    {showTaskForm ? 'Cancel' : 'Add Task'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showTaskForm && (
                  <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-medium mb-3">Schedule New Maintenance Task</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="taskName">Task Name *</Label>
                        <Input
                          id="taskName"
                          value={taskForm.name}
                          onChange={(e) => handleTaskFormChange('name', e.target.value)}
                          placeholder="e.g., Clean filters, Replace belts"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="taskDate">Scheduled Date *</Label>
                          <Input
                            id="taskDate"
                            type="date"
                            value={taskForm.date}
                            onChange={(e) => handleTaskFormChange('date', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="taskFrequency">Frequency</Label>
                          <Select 
                            value={taskForm.frequency} 
                            onValueChange={(value) => handleTaskFormChange('frequency', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="once">Once</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="taskNotes">Notes</Label>
                        <Textarea
                          id="taskNotes"
                          value={taskForm.notes}
                          onChange={(e) => handleTaskFormChange('notes', e.target.value)}
                          placeholder="Additional details about this task..."
                        />
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Service Provider (Optional)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label htmlFor="providerName">Name</Label>
                            <Input
                              id="providerName"
                              value={taskForm.serviceProviderName}
                              onChange={(e) => handleTaskFormChange('serviceProviderName', e.target.value)}
                              placeholder="Provider name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="providerPhone">Phone</Label>
                            <Input
                              id="providerPhone"
                              value={taskForm.serviceProviderPhone}
                              onChange={(e) => handleTaskFormChange('serviceProviderPhone', e.target.value)}
                              placeholder="Phone number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="providerEmail">Email</Label>
                            <Input
                              id="providerEmail"
                              type="email"
                              value={taskForm.serviceProviderEmail}
                              onChange={(e) => handleTaskFormChange('serviceProviderEmail', e.target.value)}
                              placeholder="Email address"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Button onClick={handleAddTask} className="w-full gap-2">
                        <Plus className="h-4 w-4" />
                        Schedule Maintenance Task
                      </Button>
                    </div>
                  </div>
                )}
                
                {appliance.maintenanceTasks && appliance.maintenanceTasks.length > 0 ? (
                  <div className="space-y-3">
                    {appliance.maintenanceTasks.map((task) => (
                      <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 mt-0.5"
                          onClick={() => toggleTaskCompletion(task.id)}
                        >
                          {task.completed ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border border-muted-foreground" />
                          )}
                        </Button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {task.name}
                            </p>
                            {task.completed && (
                              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                Completed
                              </Badge>
                            )}
                            {!task.completed && new Date(task.date) < new Date() && (
                              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                                <Clock className="h-3 w-3 mr-1" />
                                Overdue
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
                          {task.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Notes: {task.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No maintenance tasks scheduled yet</p>
                    <Button 
                      variant="ghost" 
                      className="mt-2"
                      onClick={() => setShowTaskForm(true)}
                    >
                      Schedule your first task
                    </Button>
                  </div>
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