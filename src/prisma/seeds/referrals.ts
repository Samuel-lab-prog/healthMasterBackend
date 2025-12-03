import { prisma } from '../client';

export async function seedReferrals() {
  const referralsData = [
    { consultationId: 1, notes: 'Referred for heart palpitations' },
    { consultationId: 2, notes: 'Referred for skin rash' },
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
