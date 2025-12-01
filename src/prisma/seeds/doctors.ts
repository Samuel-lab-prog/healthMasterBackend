import { prisma } from '../client';

async function seedDoctors() {
  const DoctorsData = [
    {
      firstName: 'Margarida',
      lastName: 'Domingues',
      email: 'margaridadomingues@doctor.com',
      phoneNumber: '123-456-7890',
      password: 'hashedpassword1',
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
      password: 'hashedpassword2',
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