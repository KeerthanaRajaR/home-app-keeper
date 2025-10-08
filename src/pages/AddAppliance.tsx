import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function AddAppliance() {
  const navigate = useNavigate();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to a database
    toast.success('Appliance added successfully!');
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
