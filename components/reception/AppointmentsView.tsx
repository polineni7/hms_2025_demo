import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Calendar, Clock, User } from 'lucide-react';

export function AppointmentsView() {
  const { visits, patients, doctors, serviceTypes } = useApp();

  const sortedVisits = [...visits].sort((a, b) => {
    const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
    const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
    return dateB.getTime() - dateA.getTime();
  });

  const getPatientName = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || 'Unknown';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor?.name || 'Unknown';
  };

  const getDoctorDepartment = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return 'Unknown';
    const dept = serviceTypes.find(st => st.id === doctor.serviceTypeId);
    return dept?.name || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments Schedule</CardTitle>
        <CardDescription>View and manage all appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Visit Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedVisits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    {getPatientName(visit.patientId)}
                  </div>
                </TableCell>
                <TableCell>{getDoctorName(visit.doctorId)}</TableCell>
                <TableCell>{getDoctorDepartment(visit.doctorId)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{visit.appointmentDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{visit.appointmentTime}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {visit.isFirstVisit ? (
                    <Badge variant="default">First Visit</Badge>
                  ) : (
                    <Badge variant="secondary">Follow-up</Badge>
                  )}
                  {visit.isFree && (
                    <Badge variant="outline" className="ml-1">Free</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(visit.status)}`}>
                    {visit.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {visits.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  No appointments scheduled yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
