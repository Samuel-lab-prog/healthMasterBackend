import { seedUsers } from './users';
import { seedDoctors } from './doctors';
import { seedConsultations } from './consultations';
import { seedReferrals } from './referrals';

async function main() {
  await seedUsers();
  await seedDoctors();
  await seedConsultations();
  await seedReferrals();
}

main()
  .then(() => {
    console.log('Seeding completed successfully.');
  })
  .catch((error) => {
    console.error('Error during seeding:', error);
  })