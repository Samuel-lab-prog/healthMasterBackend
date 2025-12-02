import { prisma } from '../client';

export async function seedConsultations() {
  const consultationsData = [
    { userId: 1, doctorId: 1, date: '2024-07-01', notes: 'Checkup de rotina' },
    { userId: 1, doctorId: 2, date: '2024-07-03', notes: 'Consulta para dores de cabeça frequentes' },
    { userId: 2, doctorId: 1, date: '2024-07-02', notes: 'Consulta para erupção cutânea' },
  ];

  for (const consultation of consultationsData) {
    const doctorExists = await prisma.doctor.findUnique({ where: { id: consultation.doctorId } });
    const userExists = await prisma.user.findUnique({ where: { id: consultation.userId } });

    if (!doctorExists || !userExists) {
      console.log(`Skipping consultation: doctorId ${consultation.doctorId}, userId ${consultation.userId} not found`);
      continue;
    }

    await prisma.consultation.create({ data: consultation });
  }
}
