import { useState } from 'react';
import { Layout } from './Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ServiceTypesManager } from './admin/ServiceTypesManager';
import { ServicesManager } from './admin/ServicesManager';
import { DoctorsManager } from './admin/DoctorsManager';
import { PatientsManager } from './admin/PatientsManager';
import { DoctorServicesManager } from './admin/DoctorServicesManager';
import { OverviewTab } from './admin/OverviewTab';

export function AdminDashboard() {
  return (
    <Layout title="Admin Dashboard">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="service-types">Service Types</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="doctor-services">Doctor Services</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="service-types">
          <ServiceTypesManager />
        </TabsContent>

        <TabsContent value="services">
          <ServicesManager />
        </TabsContent>

        <TabsContent value="doctors">
          <DoctorsManager />
        </TabsContent>

        <TabsContent value="doctor-services">
          <DoctorServicesManager />
        </TabsContent>

        <TabsContent value="patients">
          <PatientsManager />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
