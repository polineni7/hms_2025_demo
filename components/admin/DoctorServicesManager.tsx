import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export function DoctorServicesManager() {
  const { doctorServices, doctors, services, addDoctorService, updateDoctorService, deleteDoctorService } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingDS, setEditingDS] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    doctorId: '',
    serviceId: '',
    customPrice: undefined as number | undefined,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDS) {
      updateDoctorService(editingDS, formData);
      setEditingDS(null);
    } else {
      addDoctorService(formData);
      setIsAddOpen(false);
    }
    setFormData({ doctorId: '', serviceId: '', customPrice: undefined });
  };

  const handleEdit = (ds: any) => {
    setEditingDS(ds.id);
    setFormData({
      doctorId: ds.doctorId,
      serviceId: ds.serviceId,
      customPrice: ds.customPrice,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this doctor-service mapping?')) {
      deleteDoctorService(id);
    }
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor?.name || 'Unknown';
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name || 'Unknown';
  };

  const getServiceBasePrice = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.baseCost || 0;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Doctor Services Management</CardTitle>
            <CardDescription>Map services to doctors with custom pricing overrides</CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Mapping
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add Doctor-Service Mapping</DialogTitle>
                  <DialogDescription>Associate a service with a doctor</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctorId">Doctor</Label>
                    <Select value={formData.doctorId} onValueChange={(value) => setFormData({ ...formData, doctorId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map(d => (
                          <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceId">Service</Label>
                    <Select value={formData.serviceId} onValueChange={(value) => setFormData({ ...formData, serviceId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(s => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} (Base: ${s.baseCost})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customPrice">Custom Price (Optional)</Label>
                    <Input
                      id="customPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Leave empty to use base price"
                      value={formData.customPrice || ''}
                      onChange={(e) => setFormData({ ...formData, customPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Mapping</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Custom Price</TableHead>
              <TableHead>Final Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctorServices.map((ds) => {
              const basePrice = getServiceBasePrice(ds.serviceId);
              const finalPrice = ds.customPrice || basePrice;
              return (
                <TableRow key={ds.id}>
                  <TableCell>{getDoctorName(ds.doctorId)}</TableCell>
                  <TableCell>{getServiceName(ds.serviceId)}</TableCell>
                  <TableCell>${basePrice.toFixed(2)}</TableCell>
                  <TableCell>
                    {ds.customPrice ? (
                      <span className="text-blue-600">${ds.customPrice.toFixed(2)}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">${finalPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(ds)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(ds.id)}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {doctorServices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No doctor-service mappings yet. Add one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {editingDS && (
        <Dialog open={!!editingDS} onOpenChange={() => setEditingDS(null)}>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Doctor-Service Mapping</DialogTitle>
                <DialogDescription>Update service association</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-doctorId">Doctor</Label>
                  <Select value={formData.doctorId} onValueChange={(value) => setFormData({ ...formData, doctorId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-serviceId">Service</Label>
                  <Select value={formData.serviceId} onValueChange={(value) => setFormData({ ...formData, serviceId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} (Base: ${s.baseCost})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-customPrice">Custom Price (Optional)</Label>
                  <Input
                    id="edit-customPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Leave empty to use base price"
                    value={formData.customPrice || ''}
                    onChange={(e) => setFormData({ ...formData, customPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingDS(null)}>Cancel</Button>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
