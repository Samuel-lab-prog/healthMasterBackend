import { prisma } from '../client';

async function seedConsultations() {
  const ConsultationsData = [
    {
      userId: 1,
      doctorId: 1,
      date: '2024-07-01',
      notes: 'Checkup de rotina',
    },
    {
      userId: 1,
      doctorId: 2,
      date: '2024-07-03',
      notes: 'Consulta para dores de cabeça frequentes',
    },
    {
      userId: 2,
      doctorId: 1,
      date: '2024-07-02',
      notes: 'Consulta para erupção cutânea',
    },
  ];

  ConsultationsData.map(async (consultation) => {
    await prisma.consultation.create({
      data: consultation,
    });
  });
}

seedConsultations().then(() => {
  console.log('Consultations seeded successfully.');
}).catch((error) => {
  console.error('Error seeding Consultations:', error);
});