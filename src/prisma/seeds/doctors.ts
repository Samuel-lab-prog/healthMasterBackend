import { prisma } from '../client';

async function seedDoctors() {
  const DoctorsData = [
    {
      firstName: 'Margarida',
      lastName: 'Domingues',
      email: 'margaridadomingues@doctor.com',
      phoneNumber: '123-456-7890',
      password: '$2b$10$N5d3Gu9fbGYeS.s5v5EY0.JoVlWQLD6cr8g3OEbXvdWaWx6jpUeD6',
      birthDate: "1990-01-01",
      cpf: '12345678901',
      role:'admin' as 'admin' | 'doctor',
      crm: 'CRM123456',
      speciality: 'Cardiology',
    },
    {
      firstName: 'Paulo',
      lastName: 'Costa',
      email: 'paulocosta@doctor.com',
      phoneNumber: '987-654-3210',
      password: '$2b$10$N5d3Gu9fbGYeS.s5v5EY0.JoVlWQLD6cr8g3OEbXvdWaWx6jpUeD6',
      birthDate: "1985-05-15",
      cpf: '10987654321',
      role:'doctor' as 'admin' | 'doctor',
      crm: 'CRM654321',
      speciality: 'Dermatology',
    },
  ];

DoctorsData.map(async (doctor) => {
    await prisma.doctor.create({
      data: doctor,
    });
  });
}

seedDoctors().then(() => {
  console.log('Doctors seeded successfully.');
}).catch((error) => {
  console.error('Error seeding Doctors:', error);
});