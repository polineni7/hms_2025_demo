import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react';

export function ServiceTypesManager() {
  const { serviceTypes, addServiceType, updateServiceType, deleteServiceType } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
    description: '',
    level: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType) {
      updateServiceType(editingType, formData);
      setEditingType(null);
    } else {
      addServiceType(formData);
      setIsAddOpen(false);
    }
    setFormData({ name: '', parentId: '', description: '', level: 0 });
  };

  const handleEdit = (type: any) => {
    setEditingType(type.id);
    setFormData({
      name: type.name,
      parentId: type.parentId || '',
      description: type.description,
      level: type.level,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service type?')) {
      deleteServiceType(id);
    }
  };

  const getParentName = (parentId: string | null) => {
    if (!parentId) return 'Root Level';
    const parent = serviceTypes.find(st => st.id === parentId);
    return parent?.name || 'Unknown';
  };

  const rootTypes = serviceTypes.filter(st => st.parentId === null);
  
  const renderTree = (parentId: string | null, depth: number = 0) => {
    const children = serviceTypes.filter(st => st.parentId === parentId);
    
    return children.map(type => (
      <div key={type.id} style={{ marginLeft: `${depth * 24}px` }} className="border-l-2 border-gray-200 pl-4 py-2">
        <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
          <div className="flex items-center gap-3">
            <FolderTree className="w-4 h-4 text-gray-400" />
            <div>
              <p>{type.name}</p>
              <p className="text-sm text-gray-500">{type.description}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleEdit(type)}>
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDelete(type.id)}>
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
        {renderTree(type.id, depth + 1)}
      </div>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Service Types Management</CardTitle>
            <CardDescription>Manage hierarchical service types and departments</CardDescription>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Service Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add New Service Type</DialogTitle>
                  <DialogDescription>Create a new service type or department</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentId">Parent Service Type</Label>
                    <Select value={formData.parentId} onValueChange={(value) => setFormData({ ...formData, parentId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None (Root Level)</SelectItem>
                        {serviceTypes.map(st => (
                          <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Service Type</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {renderTree(null)}
          {serviceTypes.length === 0 && (
            <p className="text-center text-gray-500 py-8">No service types yet. Add one to get started.</p>
          )}
        </div>
      </CardContent>

      {editingType && (
        <Dialog open={!!editingType} onOpenChange={() => setEditingType(null)}>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Service Type</DialogTitle>
                <DialogDescription>Update service type information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-parentId">Parent Service Type</Label>
                  <Select value={formData.parentId} onValueChange={(value) => setFormData({ ...formData, parentId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None (Root Level)</SelectItem>
                      {serviceTypes.filter(st => st.id !== editingType).map(st => (
                        <SelectItem key={st.id} value={st.id}>{st.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingType(null)}>Cancel</Button>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
