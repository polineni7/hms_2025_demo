import { useState } from 'react';
import { Layout } from './Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PatientSearch } from './reception/PatientSearch';
import { ConsultationBooking } from './reception/ConsultationBooking';
import { AppointmentsView } from './reception/AppointmentsView';
import { BillingModule } from './reception/BillingModule';

export function ReceptionDashboard() {
  return (
    <Layout title="Reception Dashboard">
      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <PatientSearch />
        </TabsContent>

        <TabsContent value="consultations">
          <ConsultationBooking />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsView />
        </TabsContent>

        <TabsContent value="billing">
          <BillingModule />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
