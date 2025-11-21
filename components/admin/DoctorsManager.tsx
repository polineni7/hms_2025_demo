import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Switch } from '../ui/switch';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export function DoctorsManager() {
  const { doctors, serviceTypes, addDoctor, updateDoctor, deleteDoctor } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceTypeId: '',
    specialization: '',
    available: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDoctor) {
      updateDoctor(editingDoctor, formData);
      setEditingDoctor(null);
    } else {
      addDoctor(formData);
      setIsAddOpen(false);
    }
    setFormData({ name: '', email: '', phone: '', serviceTypeId: '', specialization: '', available: true });
  };

  const handleEdit = (doctor: any) => {
    setEditingDoctor(doctor.id);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      serviceTypeId: doctor.serviceTypeId,
      specialization: doctor.specialization,
      available: doctor.available,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      deleteDoctor(id);
    }
  };

  const toggleAvailability = (id: string, currentStatus: boolean) => {
    updateDoctor(id, { available: !currentStatus });
  };

  const getDepartmentName = (serviceTypeId: string) => {
    const type = serviceTypes.find(st => st.id === serviceTypeId);
    return type?.name || 'Unknown';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Doctors Management</CardTitle>
            <CardDescription>Manage doctor profiles and department assignments</CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Doctor</DialogTitle>
                  <DialogDescription>Register a new doctor in the system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Doctor Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceTypeId">Department</Label>
                    <Select value={formData.serviceTypeId} onValueChange={(value) => setFormData({ ...formData, serviceTypeId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map(st => (
                          <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="available"
                      checked={formData.available}
                      onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                    />
                    <Label htmlFor="available">Available for appointments</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Doctor</Button>
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
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>{getDepartmentName(doctor.serviceTypeId)}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{doctor.email}</div>
                    <div className="text-gray-500">{doctor.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={doctor.available}
                      onCheckedChange={() => toggleAvailability(doctor.id, doctor.available)}
                    />
                    <span className={doctor.available ? 'text-green-600' : 'text-red-600'}>
                      {doctor.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(doctor)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(doctor.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {doctors.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No doctors yet. Add one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {editingDoctor && (
        <Dialog open={!!editingDoctor} onOpenChange={() => setEditingDoctor(null)}>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Doctor</DialogTitle>
                <DialogDescription>Update doctor information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Doctor Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-serviceTypeId">Department</Label>
                  <Select value={formData.serviceTypeId} onValueChange={(value) => setFormData({ ...formData, serviceTypeId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map(st => (
                        <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-specialization">Specialization</Label>
                  <Input
                    id="edit-specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="edit-available"
                    checked={formData.available}
                    onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                  />
                  <Label htmlFor="edit-available">Available for appointments</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingDoctor(null)}>Cancel</Button>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
