import { prisma } from '../client';

async function seedUsers() {
  const usersData = [
    {
      firstName: 'Samuel',
      lastName: 'Gomes',
      email: 'samuelgomes@user.com',
      phoneNumber: '51991669896',
      password: 'hashedpassword1',
      birthDate: "17/12/2007",
      cpf: '12345678901',
    },
    {
      firstName: 'Leonel',
      lastName: 'Rocha',
      email: 'leonelrocha@user.com',
      phoneNumber: '987-654-3210',
      password: 'hashedpassword2',
      birthDate: "23/08/1985",
      cpf: '10987654321',
    }

  ];
  for (const user of usersData) {
    await prisma.user.create({
      data: user,
    });
  }
}
seedUsers().then(() => {
  console.log('Users seeded successfully.');
}).catch((error) => {
  console.error('Error seeding users:', error);
});