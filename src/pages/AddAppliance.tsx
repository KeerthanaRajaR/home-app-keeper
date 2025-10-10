import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppliances } from '@/contexts/ApplianceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Wrench } from 'lucide-react';
import { toast } from 'sonner';

export default function AddAppliance() {
  const navigate = useNavigate();
  const { addAppliance } = useAppliances();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    category: '',
    purchaseDate: '',
    warrantyMonths: '',
    serialNumber: '',
    purchaseLocation: '',
    supportName: '',
    supportPhone: '',
    supportEmail: '',
    supportWebsite: '',
    notes: ''
  });
  
  // Maintenance tasks state
  const [maintenanceTasks, setMaintenanceTasks] = useState<any[]>([]);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAppliance = {
      name: formData.name,
      brand: formData.brand,
      model: formData.model,
      category: formData.category,
      purchaseDate: formData.purchaseDate,
      warrantyMonths: parseInt(formData.warrantyMonths),
      serialNumber: formData.serialNumber || undefined,
      purchaseLocation: formData.purchaseLocation || undefined,
      supportContact: (formData.supportName || formData.supportPhone || formData.supportEmail || formData.supportWebsite) ? {
        name: formData.supportName,
        phone: formData.supportPhone || undefined,
        email: formData.supportEmail || undefined,
        website: formData.supportWebsite || undefined,
      } : undefined,
      maintenanceTasks: maintenanceTasks.length > 0 ? maintenanceTasks : undefined,
      notes: formData.notes || undefined,
    };

    addAppliance(newAppliance);
    toast.success('Appliance added successfully!');
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
      toast.error('Please fill in required fields');
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

    setMaintenanceTasks(prev => [...prev, newTask]);

    // Reset form
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
    toast.success('Maintenance task added!');
  };

  // Handle removing a maintenance task
  const handleRemoveTask = (index: number) => {
    setMaintenanceTasks(prev => prev.filter((_, i) => i !== index));
    toast.info('Maintenance task removed');
  };

  // ... rest of the existing code remains the same ...

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">Add New Appliance</h1>
          <p className="text-muted-foreground">Keep track of your home appliances and their warranties</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about your appliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Appliance Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Samsung Refrigerator"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    name="brand"
                    placeholder="e.g., Samsung"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Model Number *</Label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="e.g., RF28R7351SR"
                    value={formData.model}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g., Kitchen, Laundry"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  placeholder="Enter serial number"
                  value={formData.serialNumber}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Purchase & Warranty</CardTitle>
              <CardDescription>When and where you bought this appliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date *</Label>
                  <Input
                    id="purchaseDate"
                    name="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warrantyMonths">Warranty Duration (months) *</Label>
                  <Input
                    id="warrantyMonths"
                    name="warrantyMonths"
                    type="number"
                    placeholder="e.g., 12"
                    value={formData.warrantyMonths}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseLocation">Purchase Location</Label>
                <Input
                  id="purchaseLocation"
                  name="purchaseLocation"
                  placeholder="e.g., Best Buy, Amazon"
                  value={formData.purchaseLocation}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support Contact</CardTitle>
              <CardDescription>Customer service and warranty information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="supportName">Support Center Name</Label>
                <Input
                  id="supportName"
                  name="supportName"
                  placeholder="e.g., Samsung Support"
                  value={formData.supportName}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Phone Number</Label>
                  <Input
                    id="supportPhone"
                    name="supportPhone"
                    type="tel"
                    placeholder="e.g., 1-800-SAMSUNG"
                    value={formData.supportPhone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Email</Label>
                  <Input
                    id="supportEmail"
                    name="supportEmail"
                    type="email"
                    placeholder="support@example.com"
                    value={formData.supportEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supportWebsite">Website</Label>
                <Input
                  id="supportWebsite"
                  name="supportWebsite"
                  type="url"
                  placeholder="https://support.example.com"
                  value={formData.supportWebsite}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Maintenance Schedule
                  </CardTitle>
                  <CardDescription>Plan maintenance tasks for this appliance</CardDescription>
                </div>
                <Button 
                  type="button"
                  variant="outline" 
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
                  <h3 className="font-medium mb-3">Add Maintenance Task</h3>
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
                    
                    <Button type="button" onClick={handleAddTask} className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Add Maintenance Task
                    </Button>
                  </div>
                </div>
              )}
              
              {maintenanceTasks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Scheduled Tasks ({maintenanceTasks.length})</h4>
                  {maintenanceTasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div>
                        <p className="font-medium text-foreground">{task.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(task.date).toLocaleDateString()} • {task.frequency}
                        </p>
                      </div>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveTask(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {!showTaskForm && maintenanceTasks.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Wrench className="h-8 w-8 mx-auto mb-2" />
                  <p>No maintenance tasks added yet</p>
                  <Button 
                    type="button"
                    variant="ghost" 
                    className="mt-2"
                    onClick={() => setShowTaskForm(true)}
                  >
                    Add your first maintenance task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>Any other information you'd like to remember</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Special features, issues, maintenance history..."
                value={formData.notes}
                onChange={handleChange}
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1 gap-2">
              <Plus className="h-4 w-4" />
              Add Appliance
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}