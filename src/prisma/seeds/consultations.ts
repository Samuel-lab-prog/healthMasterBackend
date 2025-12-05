import { prisma } from '../client';
import { type ConsultationStatus, type ConsultationTypes } from '../../routes/consultations/types';

export async function seedConsultations() {
  const consultationsData: {
    userId: number;
    doctorId: number;
    date: Date;
    endTime: Date;
    notes: string;
    status: ConsultationStatus;
    type: ConsultationTypes;
    location: string;
  }[] = [
    {
      userId: 1,
      doctorId: 1,
      date: new Date('2024-07-01T09:00:00Z'),
      endTime: new Date('2024-07-01T10:30:00Z'),
      notes: 'Checkup de rotina',
      status: 'scheduled',
      type: 'routine',
      location: 'Clínica A',
    },
    {
      userId: 1,
      doctorId: 2,
      date: new Date('2024-07-03T09:00:00Z'),
      endTime: new Date('2024-07-03T11:00:00Z'),
      notes: 'Consulta para dores de cabeça frequentes',
      status: 'scheduled',
      type: 'exam',
      location: 'Clínica C',
    },
    {
      userId: 2,
      doctorId: 1,
      date: new Date('2024-07-02T09:00:00Z'),
      endTime: new Date('2024-07-02T11:00:00Z'),
      notes: 'Consulta para erupção cutânea',
      status: 'scheduled',
      type: 'checkup',
      location: 'Clínica B',
    },
  ];

  for (const consultation of consultationsData) {
    const doctorExists = await prisma.doctor.findUnique({ where: { id: consultation.doctorId } });
    const userExists = await prisma.user.findUnique({ where: { id: consultation.userId } });

    if (!doctorExists || !userExists) {
      console.log(
        `Skipping consultation: doctorId ${consultation.doctorId}, userId ${consultation.userId} not found`
      );
      continue;
    }

    await prisma.consultation.create({ data: consultation });
  }
}
