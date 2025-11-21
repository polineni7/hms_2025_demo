import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { DollarSign, Receipt } from 'lucide-react';

export function BillingModule() {
  const { bills, patients, updateBill } = useApp();
  const [selectedBill, setSelectedBill] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');

  const bill = bills.find(b => b.id === selectedBill);

  const handlePayment = () => {
    if (!selectedBill || !paymentAmount) return;
    
    const amount = parseFloat(paymentAmount);
    const currentBill = bills.find(b => b.id === selectedBill);
    if (!currentBill) return;

    const newPaidAmount = currentBill.paidAmount + amount;
    const newStatus = newPaidAmount >= currentBill.totalAmount ? 'paid' : 
                     newPaidAmount > 0 ? 'partial' : 'pending';

    updateBill(selectedBill, {
      paidAmount: newPaidAmount,
      status: newStatus as 'pending' | 'paid' | 'partial',
    });

    setSelectedBill(null);
    setPaymentAmount('');
  };

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'partial': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Billing & Payments</CardTitle>
          <CardDescription>Manage bills and process payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-mono text-sm">#{bill.id.slice(-6)}</TableCell>
                  <TableCell>{getPatientName(bill.patientId)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {bill.items.map(item => item.name).join(', ')}
                    </div>
                  </TableCell>
                  <TableCell>${bill.totalAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-green-600">${bill.paidAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-red-600">
                    ${(bill.totalAmount - bill.paidAmount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(bill.status)}`}>
                      {bill.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {bill.status !== 'paid' && (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedBill(bill.id);
                          setPaymentAmount((bill.totalAmount - bill.paidAmount).toString());
                        }}
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Pay
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {bills.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                    No bills generated yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-2xl text-green-600">
                ${bills.reduce((sum, b) => sum + b.paidAmount, 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Outstanding Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-red-600" />
              <span className="text-2xl text-red-600">
                ${bills.reduce((sum, b) => sum + (b.totalAmount - b.paidAmount), 0).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Pending Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-lg">
                {bills.filter(b => b.status === 'pending').length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {bill && (
        <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Process Payment</DialogTitle>
              <DialogDescription>Bill #{bill.id.slice(-6)}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Patient:</span>
                  <span>{getPatientName(bill.patientId)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Amount:</span>
                  <span>${bill.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Paid Amount:</span>
                  <span className="text-green-600">${bill.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span>Balance Due:</span>
                  <span className="text-red-600">${(bill.totalAmount - bill.paidAmount).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Items:</Label>
                <div className="space-y-1">
                  {bill.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm p-2 bg-blue-50 rounded">
                      <span>{item.name}</span>
                      <span>${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment">Payment Amount</Label>
                <Input
                  id="payment"
                  type="number"
                  min="0"
                  step="0.01"
                  max={bill.totalAmount - bill.paidAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedBill(null)}>Cancel</Button>
              <Button onClick={handlePayment}>Process Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
