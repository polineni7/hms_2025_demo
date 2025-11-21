import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Users, Stethoscope, UserCheck, DollarSign, Activity, Calendar } from 'lucide-react';

export function OverviewTab() {
  const { patients, doctors, visits, bills, consultations } = useApp();

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Doctors',
      value: doctors.filter(d => d.available).length,
      icon: Stethoscope,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Consultations',
      value: consultations.filter(c => c.isActive).length,
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Pending Visits',
      value: visits.filter(v => v.status === 'pending').length,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Total Revenue',
      value: `$${bills.reduce((sum, b) => sum + b.paidAmount, 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'Completed Visits',
      value: visits.filter(v => v.status === 'completed').length,
      icon: Activity,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {visits.slice(-5).reverse().map((visit) => {
                const patient = patients.find(p => p.id === visit.patientId);
                const doctor = doctors.find(d => d.id === visit.doctorId);
                return (
                  <div key={visit.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm">{patient?.name}</p>
                      <p className="text-xs text-gray-500">{doctor?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{visit.appointmentDate}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        visit.status === 'completed' ? 'bg-green-100 text-green-700' :
                        visit.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {visit.status}
                      </span>
                    </div>
                  </div>
                );
              })}
              {visits.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No visits yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doctor Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm">{doctor.name}</p>
                    <p className="text-xs text-gray-500">{doctor.specialization}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    doctor.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {doctor.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              ))}
              {doctors.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No doctors yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
