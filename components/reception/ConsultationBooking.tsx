import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar, Clock, DollarSign } from 'lucide-react';

export function ConsultationBooking() {
  const { 
    patients, 
    serviceTypes, 
    doctors, 
    services,
    doctorServices,
    consultations, 
    addConsultation,
    addVisit,
    addBill 
  } = useApp();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientId: '',
    departmentId: '',
    doctorId: '',
    serviceId: '',
    validityType: 'weeks' as 'days' | 'weeks' | 'months',
    validityValue: 2,
    appointmentDate: '',
    appointmentTime: '10:00',
  });

  const calculateEndDate = (startDate: string, type: string, value: number) => {
    const date = new Date(startDate);
    if (type === 'days') {
      date.setDate(date.getDate() + value);
    } else if (type === 'weeks') {
      date.setDate(date.getDate() + (value * 7));
    } else if (type === 'months') {
      date.setMonth(date.getMonth() + value);
    }
    return date.toISOString().split('T')[0];
  };

  const departmentDoctors = doctors.filter(d => 
    d.serviceTypeId === formData.departmentId && d.available
  );

  const departmentServices = services.filter(s => 
    s.serviceTypeId === formData.departmentId
  );

  const getServicePrice = (serviceId: string, doctorId: string) => {
    const doctorService = doctorServices.find(ds => 
      ds.serviceId === serviceId && ds.doctorId === doctorId
    );
    if (doctorService?.customPrice) {
      return doctorService.customPrice;
    }
    const service = services.find(s => s.id === serviceId);
    return service?.baseCost || 0;
  };

  const handleSubmit = () => {
    if (!formData.patientId || !formData.departmentId || !formData.doctorId || 
        !formData.serviceId || !formData.appointmentDate) {
      alert('Please fill all required fields');
      return;
    }

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = calculateEndDate(startDate, formData.validityType, formData.validityValue);

    // Create consultation
    const consultation = {
      patientId: formData.patientId,
      departmentId: formData.departmentId,
      validityType: formData.validityType,
      validityValue: formData.validityValue,
      startDate,
      endDate,
      isActive: true,
    };
    addConsultation(consultation);
    const consultationId = `cons${Date.now()}`;

    // Create first visit
    const visit = {
      consultationId,
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      status: 'pending' as const,
      isFirstVisit: true,
      isFree: false,
      notes: '',
    };
    addVisit(visit);

    // Create bill for first visit
    const price = getServicePrice(formData.serviceId, formData.doctorId);
    const service = services.find(s => s.id === formData.serviceId);
    const bill = {
      patientId: formData.patientId,
      items: [{
        id: `item${Date.now()}`,
        type: 'consultation' as const,
        name: service?.name || 'Consultation',
        amount: price,
      }],
      totalAmount: price,
      paidAmount: 0,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
    addBill(bill);

    alert('Consultation and appointment created successfully!');
    setStep(1);
    setFormData({
      patientId: '',
      departmentId: '',
      doctorId: '',
      serviceId: '',
      validityType: 'weeks',
      validityValue: 2,
      appointmentDate: '',
      appointmentTime: '10:00',
    });
  };

  const selectedPatient = patients.find(p => p.id === formData.patientId);
  const selectedDoctor = doctors.find(d => d.id === formData.doctorId);
  const selectedDepartment = serviceTypes.find(st => st.id === formData.departmentId);
  const selectedService = services.find(s => s.id === formData.serviceId);
  const consultationPrice = formData.serviceId && formData.doctorId 
    ? getServicePrice(formData.serviceId, formData.doctorId)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>New Consultation Booking</CardTitle>
            <CardDescription>Step {step} of 3</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Patient</Label>
                  <Select value={formData.patientId} onValueChange={(value) => setFormData({ ...formData, patientId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(p => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} - {p.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Select Department</Label>
                  <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value, doctorId: '', serviceId: '' })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose department" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.filter(st => st.parentId !== null).map(st => (
                        <SelectItem key={st.id} value={st.id}>
                          {st.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Validity Type</Label>
                    <Select value={formData.validityType} onValueChange={(value: any) => setFormData({ ...formData, validityType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Validity Duration</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.validityValue}
                      onChange={(e) => setFormData({ ...formData, validityValue: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <Button onClick={() => setStep(2)} className="w-full" disabled={!formData.patientId || !formData.departmentId}>
                  Next: Select Doctor & Service
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Service</Label>
                  <Select value={formData.serviceId} onValueChange={(value) => setFormData({ ...formData, serviceId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose service" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentServices.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} - ${s.baseCost}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Select Doctor</Label>
                  <Select value={formData.doctorId} onValueChange={(value) => setFormData({ ...formData, doctorId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {departmentDoctors.map(d => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name} - {d.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1" disabled={!formData.doctorId || !formData.serviceId}>
                    Next: Schedule Appointment
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Appointment Date</Label>
                  <Input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Appointment Time</Label>
                  <Select value={formData.appointmentTime} onValueChange={(value) => setFormData({ ...formData, appointmentTime: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1" disabled={!formData.appointmentDate}>
                    Confirm Booking
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPatient && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500">Patient</p>
                <p>{selectedPatient.name}</p>
              </div>
            )}

            {selectedDepartment && (
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-500">Department</p>
                <p>{selectedDepartment.name}</p>
              </div>
            )}

            {selectedService && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-500">Service</p>
                <p>{selectedService.name}</p>
              </div>
            )}

            {selectedDoctor && (
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-500">Doctor</p>
                <p>{selectedDoctor.name}</p>
                <p className="text-xs text-gray-600">{selectedDoctor.specialization}</p>
              </div>
            )}

            {formData.appointmentDate && (
              <div className="p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-gray-500">Appointment</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <p>{formData.appointmentDate}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4" />
                  <p>{formData.appointmentTime}</p>
                </div>
              </div>
            )}

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Validity</p>
              <p>{formData.validityValue} {formData.validityType}</p>
              <p className="text-xs text-gray-600">Unlimited follow-ups</p>
            </div>

            {consultationPrice > 0 && (
              <div className="p-3 bg-emerald-50 rounded-lg">
                <p className="text-sm text-gray-500">First Visit Cost</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <p className="text-xl text-emerald-600">${consultationPrice.toFixed(2)}</p>
                </div>
                <p className="text-xs text-gray-600 mt-1">Follow-ups: FREE</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
