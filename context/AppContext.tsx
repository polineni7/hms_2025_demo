import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'reception' | 'financial' | 'doctor';
  doctorId?: string;
}

export interface ServiceType {
  id: string;
  name: string;
  parentId: string | null;
  description: string;
  level: number;
}

export interface Service {
  id: string;
  name: string;
  serviceTypeId: string;
  baseCost: number;
  description: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceTypeId: string;
  specialization: string;
  available: boolean;
}

export interface DoctorService {
  id: string;
  doctorId: string;
  serviceId: string;
  customPrice?: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  medicalHistory: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  departmentId: string;
  validityType: 'days' | 'weeks' | 'months';
  validityValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Visit {
  id: string;
  consultationId: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending' | 'processing' | 'completed';
  isFirstVisit: boolean;
  isFree: boolean;
  notes: string;
  transferredFrom?: string;
  transferredTo?: string;
}

export interface Bill {
  id: string;
  patientId: string;
  visitId?: string;
  items: BillItem[];
  totalAmount: number;
  paidAmount: number;
  status: 'pending' | 'paid' | 'partial';
  createdAt: string;
}

export interface BillItem {
  id: string;
  type: 'consultation' | 'service' | 'lab';
  name: string;
  amount: number;
}

export interface LabTest {
  id: string;
  name: string;
  cost: number;
  isOutsourced: boolean;
}

export interface LabOrder {
  id: string;
  patientId: string;
  visitId: string;
  doctorId: string;
  labTestId: string;
  status: 'ordered' | 'sample-collected' | 'completed';
  orderedAt: string;
}

interface AppContextType {
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Service Types
  serviceTypes: ServiceType[];
  addServiceType: (serviceType: Omit<ServiceType, 'id'>) => void;
  updateServiceType: (id: string, serviceType: Partial<ServiceType>) => void;
  deleteServiceType: (id: string) => void;
  
  // Services
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  
  // Doctors
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  
  // Doctor Services
  doctorServices: DoctorService[];
  addDoctorService: (doctorService: Omit<DoctorService, 'id'>) => void;
  updateDoctorService: (id: string, doctorService: Partial<DoctorService>) => void;
  deleteDoctorService: (id: string) => void;
  
  // Patients
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  
  // Consultations
  consultations: Consultation[];
  addConsultation: (consultation: Omit<Consultation, 'id'>) => void;
  updateConsultation: (id: string, consultation: Partial<Consultation>) => void;
  
  // Visits
  visits: Visit[];
  addVisit: (visit: Omit<Visit, 'id'>) => void;
  updateVisit: (id: string, visit: Partial<Visit>) => void;
  transferVisit: (visitId: string, toDoctorId: string) => void;
  
  // Bills
  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id'>) => void;
  updateBill: (id: string, bill: Partial<Bill>) => void;
  
  // Lab Tests
  labTests: LabTest[];
  labOrders: LabOrder[];
  addLabOrder: (labOrder: Omit<LabOrder, 'id'>) => void;
  updateLabOrder: (id: string, labOrder: Partial<LabOrder>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock Users
const mockUsers: User[] = [
  { id: '1', username: 'admin1', name: 'Admin User', role: 'admin' },
  { id: '2', username: 'reception1', name: 'Reception Staff', role: 'reception' },
  { id: '3', username: 'financial1', name: 'Financial Admin', role: 'financial' },
  { id: '4', username: 'doctor1', name: 'Dr. John Smith', role: 'doctor', doctorId: 'doc1' },
];

// Initial Mock Data
const initialServiceTypes: ServiceType[] = [
  { id: 'st1', name: 'Medical', parentId: null, description: 'Medical Services', level: 0 },
  { id: 'st2', name: 'Cardiology', parentId: 'st1', description: 'Heart related services', level: 1 },
  { id: 'st3', name: 'Neurology', parentId: 'st1', description: 'Brain and nerve services', level: 1 },
  { id: 'st4', name: 'Pediatrics', parentId: 'st1', description: 'Child care services', level: 1 },
  { id: 'st5', name: 'Diagnostic', parentId: null, description: 'Diagnostic Services', level: 0 },
  { id: 'st6', name: 'Laboratory', parentId: 'st5', description: 'Lab tests', level: 1 },
];

const initialServices: Service[] = [
  { id: 'srv1', name: 'General Consultation', serviceTypeId: 'st2', baseCost: 500, description: 'Basic checkup' },
  { id: 'srv2', name: 'ECG', serviceTypeId: 'st2', baseCost: 300, description: 'Electrocardiogram' },
  { id: 'srv3', name: 'Neuro Consultation', serviceTypeId: 'st3', baseCost: 700, description: 'Neurological consultation' },
  { id: 'srv4', name: 'Child Checkup', serviceTypeId: 'st4', baseCost: 400, description: 'Pediatric consultation' },
];

const initialDoctors: Doctor[] = [
  { id: 'doc1', name: 'Dr. John Smith', email: 'john@hospital.com', phone: '1234567890', serviceTypeId: 'st2', specialization: 'Cardiologist', available: true },
  { id: 'doc2', name: 'Dr. Sarah Johnson', email: 'sarah@hospital.com', phone: '1234567891', serviceTypeId: 'st3', specialization: 'Neurologist', available: true },
  { id: 'doc3', name: 'Dr. Mike Williams', email: 'mike@hospital.com', phone: '1234567892', serviceTypeId: 'st4', specialization: 'Pediatrician', available: false },
];

const initialDoctorServices: DoctorService[] = [
  { id: 'ds1', doctorId: 'doc1', serviceId: 'srv1', customPrice: 600 },
  { id: 'ds2', doctorId: 'doc1', serviceId: 'srv2' },
  { id: 'ds3', doctorId: 'doc2', serviceId: 'srv3', customPrice: 800 },
];

const initialPatients: Patient[] = [
  { id: 'pat1', name: 'Alice Brown', age: 35, gender: 'Female', phone: '9876543210', email: 'alice@email.com', address: '123 Main St', medicalHistory: 'Hypertension' },
  { id: 'pat2', name: 'Bob Wilson', age: 45, gender: 'Male', phone: '9876543211', email: 'bob@email.com', address: '456 Oak Ave', medicalHistory: 'Diabetes' },
];

const initialConsultations: Consultation[] = [
  {
    id: 'cons1',
    patientId: 'pat1',
    departmentId: 'st2',
    validityType: 'weeks',
    validityValue: 2,
    startDate: '2025-11-15',
    endDate: '2025-11-29',
    isActive: true,
  },
];

const initialVisits: Visit[] = [
  {
    id: 'visit1',
    consultationId: 'cons1',
    patientId: 'pat1',
    doctorId: 'doc1',
    appointmentDate: '2025-11-21',
    appointmentTime: '10:00',
    status: 'pending',
    isFirstVisit: false,
    isFree: true,
    notes: '',
  },
];

const initialBills: Bill[] = [];

const initialLabTests: LabTest[] = [
  { id: 'lab1', name: 'Complete Blood Count', cost: 250, isOutsourced: false },
  { id: 'lab2', name: 'Blood Sugar Test', cost: 150, isOutsourced: false },
  { id: 'lab3', name: 'MRI Scan', cost: 5000, isOutsourced: true },
];

const initialLabOrders: LabOrder[] = [];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>(initialServiceTypes);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [doctorServices, setDoctorServices] = useState<DoctorService[]>(initialDoctorServices);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [consultations, setConsultations] = useState<Consultation[]>(initialConsultations);
  const [visits, setVisits] = useState<Visit[]>(initialVisits);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [labTests] = useState<LabTest[]>(initialLabTests);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(initialLabOrders);

  const login = (username: string, password: string): boolean => {
    if (password === 'password') {
      const user = mockUsers.find(u => u.username === username);
      if (user) {
        setCurrentUser(user);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Service Types
  const addServiceType = (serviceType: Omit<ServiceType, 'id'>) => {
    const newServiceType = { ...serviceType, id: `st${Date.now()}` };
    setServiceTypes([...serviceTypes, newServiceType]);
  };

  const updateServiceType = (id: string, serviceType: Partial<ServiceType>) => {
    setServiceTypes(serviceTypes.map(st => st.id === id ? { ...st, ...serviceType } : st));
  };

  const deleteServiceType = (id: string) => {
    setServiceTypes(serviceTypes.filter(st => st.id !== id));
  };

  // Services
  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: `srv${Date.now()}` };
    setServices([...services, newService]);
  };

  const updateService = (id: string, service: Partial<Service>) => {
    setServices(services.map(s => s.id === id ? { ...s, ...service } : s));
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  // Doctors
  const addDoctor = (doctor: Omit<Doctor, 'id'>) => {
    const newDoctor = { ...doctor, id: `doc${Date.now()}` };
    setDoctors([...doctors, newDoctor]);
  };

  const updateDoctor = (id: string, doctor: Partial<Doctor>) => {
    setDoctors(doctors.map(d => d.id === id ? { ...d, ...doctor } : d));
  };

  const deleteDoctor = (id: string) => {
    setDoctors(doctors.filter(d => d.id !== id));
  };

  // Doctor Services
  const addDoctorService = (doctorService: Omit<DoctorService, 'id'>) => {
    const newDoctorService = { ...doctorService, id: `ds${Date.now()}` };
    setDoctorServices([...doctorServices, newDoctorService]);
  };

  const updateDoctorService = (id: string, doctorService: Partial<DoctorService>) => {
    setDoctorServices(doctorServices.map(ds => ds.id === id ? { ...ds, ...doctorService } : ds));
  };

  const deleteDoctorService = (id: string) => {
    setDoctorServices(doctorServices.filter(ds => ds.id !== id));
  };

  // Patients
  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient = { ...patient, id: `pat${Date.now()}` };
    setPatients([...patients, newPatient]);
  };

  const updatePatient = (id: string, patient: Partial<Patient>) => {
    setPatients(patients.map(p => p.id === id ? { ...p, ...patient } : p));
  };

  // Consultations
  const addConsultation = (consultation: Omit<Consultation, 'id'>) => {
    const newConsultation = { ...consultation, id: `cons${Date.now()}` };
    setConsultations([...consultations, newConsultation]);
  };

  const updateConsultation = (id: string, consultation: Partial<Consultation>) => {
    setConsultations(consultations.map(c => c.id === id ? { ...c, ...consultation } : c));
  };

  // Visits
  const addVisit = (visit: Omit<Visit, 'id'>) => {
    const newVisit = { ...visit, id: `visit${Date.now()}` };
    setVisits([...visits, newVisit]);
  };

  const updateVisit = (id: string, visit: Partial<Visit>) => {
    setVisits(visits.map(v => v.id === id ? { ...v, ...visit } : v));
  };

  const transferVisit = (visitId: string, toDoctorId: string) => {
    const visit = visits.find(v => v.id === visitId);
    if (visit) {
      updateVisit(visitId, {
        transferredFrom: visit.doctorId,
        doctorId: toDoctorId,
        status: 'pending',
      });
    }
  };

  // Bills
  const addBill = (bill: Omit<Bill, 'id'>) => {
    const newBill = { ...bill, id: `bill${Date.now()}` };
    setBills([...bills, newBill]);
  };

  const updateBill = (id: string, bill: Partial<Bill>) => {
    setBills(bills.map(b => b.id === id ? { ...b, ...bill } : b));
  };

  // Lab Orders
  const addLabOrder = (labOrder: Omit<LabOrder, 'id'>) => {
    const newLabOrder = { ...labOrder, id: `lo${Date.now()}` };
    setLabOrders([...labOrders, newLabOrder]);
  };

  const updateLabOrder = (id: string, labOrder: Partial<LabOrder>) => {
    setLabOrders(labOrders.map(lo => lo.id === id ? { ...lo, ...labOrder } : lo));
  };

  const value: AppContextType = {
    currentUser,
    login,
    logout,
    serviceTypes,
    addServiceType,
    updateServiceType,
    deleteServiceType,
    services,
    addService,
    updateService,
    deleteService,
    doctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    doctorServices,
    addDoctorService,
    updateDoctorService,
    deleteDoctorService,
    patients,
    addPatient,
    updatePatient,
    consultations,
    addConsultation,
    updateConsultation,
    visits,
    addVisit,
    updateVisit,
    transferVisit,
    bills,
    addBill,
    updateBill,
    labTests,
    labOrders,
    addLabOrder,
    updateLabOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
