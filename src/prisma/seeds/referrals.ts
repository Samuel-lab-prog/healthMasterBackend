import { prisma } from '../client';
import { type InsertReferral } from '../../routes/referrals/types'; 

export async function seedReferrals() {
  const referralsData: InsertReferral[] = [
    { consultationId: 1, notes: 'Referred for heart palpitations' , deletedAt: null, reason: "No equipment available", referredById: 1, referredToId: 2, userId: 1 },
    { consultationId: 2, notes: 'Referred for skin rash', deletedAt: null, reason: "Specialist required", referredById: 2, referredToId: 1, userId: 2 },
    { consultationId: 3, notes: 'Referred for migraine evaluation', deletedAt: null, reason: "Advanced diagnostics needed", referredById: 1, referredToId: 2, userId: 1 },
  ];

  for (const referral of referralsData) {
    const consultationExists = await prisma.consultation.findUnique({
      where: { id: referral.consultationId },
    });
    if (!consultationExists) {
      console.log(`Skipping referral: consultationId ${referral.consultationId} not found`);
      continue;
    }

    await prisma.referral.create({ data: referral });
  }
}
