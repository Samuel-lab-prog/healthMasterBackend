import { prisma } from '../client';

export async function seedUsers() {
  const usersData = [
    {
      firstName: 'Samuel',
      lastName: 'Gomes',
      email: 'samuelgomes@user.com',
      phoneNumber: '51991669896',
      password: '$2b$10$N5d3Gu9fbGYeS.s5v5EY0.JoVlWQLD6cr8g3OEbXvdWaWx6jpUeD6',
      birthDate: new Date('2007-12-17'),
      cpf: '12345678901',
    },
    {
      firstName: 'Leonel',
      lastName: 'Rocha',
      email: 'leonelrocha@user.com',
      phoneNumber: '987-654-3210',
      password: '$2b$10$N5d3Gu9fbGYeS.s5v5EY0.JoVlWQLD6cr8g3OEbXvdWaWx6jpUeD6',
      birthDate: new Date('1990-06-25'),
      cpf: '10987654321',
    },
  ];

  for (const user of usersData) {
    const exists = await prisma.user.findUnique({ where: { email: user.email } });
    if (!exists) {
      await prisma.user.create({ data: user });
    }
  }
}
