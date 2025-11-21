import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Layout } from './Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { User, Activity, DollarSign, ArrowRightLeft, Stethoscope } from 'lucide-react';

export function DoctorDashboard() {
  const { currentUser, visits, patients, doctors, serviceTypes, bills, updateVisit, transferVisit } = useApp();
  const [selectedVisit, setSelectedVisit] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [transferDoctorId, setTransferDoctorId] = useState('');

  const doctorId = currentUser?.doctorId;
  const myVisits = visits.filter(v => v.doctorId === doctorId);
  const pendingVisits = myVisits.filter(v => v.status === 'pending');
  const processingVisits = myVisits.filter(v => v.status === 'processing');
  const completedVisits = myVisits.filter(v => v.status === 'completed');

  // Incoming transfers
  const incomingVisits = visits.filter(v => 
    v.doctorId === doctorId && v.transferredFrom
  );

  // My income (from completed visits)
  const myIncome = completedVisits.reduce((sum, visit) => {
    const bill = bills.find(b => b.visitId === visit.id);
    return sum + (bill?.paidAmount || 0);
  }, 0);

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || 'Unknown';
  };

  const getPatient = (patientId: string) => {
    return patients.find(p => p.id === patientId);
  };

  const handleStatusChange = (visitId: string, status: 'pending' | 'processing' | 'completed') => {
    updateVisit(visitId, { status });
    setSelectedVisit(null);
  };

  const handleTransfer = (visitId: string) => {
    if (!transferDoctorId) return;
    transferVisit(visitId, transferDoctorId);
    setTransferDoctorId('');
    setSelectedVisit(null);
  };

  const saveNotes = (visitId: string) => {
    updateVisit(visitId, { notes });
    setNotes('');
  };

  const visit = visits.find(v => v.id === selectedVisit);
  const patient = visit ? getPatient(visit.patientId) : null;

  // Get doctors from same and different departments
  const myDoctor = doctors.find(d => d.id === doctorId);
  const sameDeptDoctors = doctors.filter(d => 
    d.id !== doctorId && d.serviceTypeId === myDoctor?.serviceTypeId && d.available
  );
  const otherDeptDoctors = doctors.filter(d => 
    d.id !== doctorId && d.serviceTypeId !== myDoctor?.serviceTypeId && d.available
  );

  return (
    <Layout title="Doctor Dashboard">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Pending Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-yellow-600" />
                <span className="text-2xl">{pendingVisits.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <span className="text-2xl">{processingVisits.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Completed Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span className="text-2xl">{completedVisits.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span className="text-2xl text-emerald-600">${myIncome.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="pending">Pending ({pendingVisits.length})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({processingVisits.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedVisits.length})</TabsTrigger>
            <TabsTrigger value="incoming">Incoming Referrals</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Visits</CardTitle>
                <CardDescription>Patients waiting for consultation</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Visit Type</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingVisits.map((visit) => {
                      const patient = getPatient(visit.patientId);
                      return (
                        <TableRow key={visit.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p>{patient?.name}</p>
                                <p className="text-xs text-gray-500">{patient?.age} yrs / {patient?.gender}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{visit.appointmentDate}</div>
                              <div className="text-gray-500">{visit.appointmentTime}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {visit.isFirstVisit ? (
                              <Badge>First Visit</Badge>
                            ) : (
                              <Badge variant="secondary">Follow-up</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500 max-w-xs truncate">
                            {visit.notes || 'No notes'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" onClick={() => setSelectedVisit(visit.id)}>
                              Consult
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {pendingVisits.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          No pending visits
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processing">
            <Card>
              <CardHeader>
                <CardTitle>Processing Visits</CardTitle>
                <CardDescription>Ongoing consultations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Visit Type</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processingVisits.map((visit) => {
                      const patient = getPatient(visit.patientId);
                      return (
                        <TableRow key={visit.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p>{patient?.name}</p>
                                <p className="text-xs text-gray-500">{patient?.age} yrs / {patient?.gender}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{visit.appointmentDate}</div>
                              <div className="text-gray-500">{visit.appointmentTime}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {visit.isFirstVisit ? (
                              <Badge>First Visit</Badge>
                            ) : (
                              <Badge variant="secondary">Follow-up</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500 max-w-xs truncate">
                            {visit.notes || 'No notes'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" onClick={() => setSelectedVisit(visit.id)}>
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {processingVisits.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          No visits in processing
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Visits</CardTitle>
                <CardDescription>Consultation history</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Visit Type</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedVisits.slice(-10).reverse().map((visit) => {
                      const patient = getPatient(visit.patientId);
                      return (
                        <TableRow key={visit.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              {patient?.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{visit.appointmentDate}</div>
                              <div className="text-gray-500">{visit.appointmentTime}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {visit.isFirstVisit ? (
                              <Badge>First Visit</Badge>
                            ) : (
                              <Badge variant="secondary">Follow-up</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500 max-w-xs truncate">
                            {visit.notes || 'No notes'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {completedVisits.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                          No completed visits yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incoming">
            <Card>
              <CardHeader>
                <CardTitle>Incoming Referrals</CardTitle>
                <CardDescription>Patients referred from other doctors</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Referred From</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incomingVisits.map((visit) => {
                      const patient = getPatient(visit.patientId);
                      const fromDoctor = doctors.find(d => d.id === visit.transferredFrom);
                      return (
                        <TableRow key={visit.id}>
                          <TableCell>{patient?.name}</TableCell>
                          <TableCell>{fromDoctor?.name || 'Unknown'}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{visit.appointmentDate}</div>
                              <div className="text-gray-500">{visit.appointmentTime}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge>{visit.status}</Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {incomingVisits.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                          No incoming referrals
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Consultation Dialog */}
      {visit && patient && (
        <Dialog open={!!selectedVisit} onOpenChange={() => setSelectedVisit(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Patient Consultation</DialogTitle>
              <DialogDescription>{patient.name} - {patient.age} yrs / {patient.gender}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{patient.phone}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm">{patient.email}</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Medical History</p>
                <p>{patient.medicalHistory || 'No history'}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Consultation Notes</label>
                <Textarea
                  placeholder="Add consultation notes..."
                  value={notes || visit.notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
                <Button size="sm" onClick={() => saveNotes(visit.id)} disabled={!notes}>
                  Save Notes
                </Button>
              </div>

              <div className="flex gap-2">
                {visit.status === 'pending' && (
                  <Button className="flex-1" onClick={() => handleStatusChange(visit.id, 'processing')}>
                    Start Consultation
                  </Button>
                )}
                {visit.status === 'processing' && (
                  <Button className="flex-1" variant="default" onClick={() => handleStatusChange(visit.id, 'completed')}>
                    Complete Consultation
                  </Button>
                )}
              </div>

              {visit.status !== 'completed' && (
                <div className="border-t pt-4 space-y-3">
                  <label className="text-sm flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4" />
                    Transfer Patient
                  </label>
                  <Select value={transferDoctorId} onValueChange={setTransferDoctorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor to transfer" />
                    </SelectTrigger>
                    <SelectContent>
                      {sameDeptDoctors.length > 0 && (
                        <>
                          <div className="px-2 py-1 text-xs text-gray-500">Same Department</div>
                          {sameDeptDoctors.map(d => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name} - {d.specialization}
                            </SelectItem>
                          ))}
                        </>
                      )}
                      {otherDeptDoctors.length > 0 && (
                        <>
                          <div className="px-2 py-1 text-xs text-gray-500">Other Departments</div>
                          {otherDeptDoctors.map(d => {
                            const dept = serviceTypes.find(st => st.id === d.serviceTypeId);
                            return (
                              <SelectItem key={d.id} value={d.id}>
                                {d.name} - {dept?.name}
                              </SelectItem>
                            );
                          })}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    onClick={() => handleTransfer(visit.id)}
                    disabled={!transferDoctorId}
                    className="w-full"
                  >
                    Transfer Patient
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedVisit(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
}
