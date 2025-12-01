import { prisma } from '../client';

async function seedReferrals() {
  const referralsData = [
    {
      consultationId: 1,
      notes: 'Referred for heart palpitations',
    },
    {
      consultationId: 2,
      notes: 'Referred for skin rash',
    },
  ];

  referralsData.map(async (referral) => {
    await prisma.referral.create({
      data: referral,
    });
  });
}

seedReferrals().then(() => {
  console.log('Referrals seeded successfully.');
}).catch((error) => {
  console.error('Error seeding referrals:', error);
});