const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const CRENEAUX = [
  ["08:00", "10:00"],
  ["10:00", "12:00"],
  ["14:00", "16:00"],
  ["16:00", "18:00"],
  ["18:00", "20:00"],
];

function jourUtc(date) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@localhost").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme123";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.ADMIN },
    create: {
      email: adminEmail,
      name: "Admin",
      motDePasseHash: await bcrypt.hash(adminPassword, 12),
      role: Role.ADMIN,
      telephone: "+33600000000",
    },
  });

  // Fenêtre glissante d'ouverture des créneaux à partir d'aujourd'hui. Ce script doit être
  // relancé régulièrement (ex. via un cron) pour que des créneaux restent toujours disponibles
  // — sinon, une fois cette fenêtre écoulée, plus aucun créneau futur n'apparaît en réservation.
  const JOURS_OUVERTURE = 60;
  const start = new Date();
  for (let i = 1; i <= JOURS_OUVERTURE; i += 1) {
    const day = addDays(start, i);
    const weekday = day.getDay();
    if (weekday === 0) continue;
    const slots = weekday === 6 ? CRENEAUX.slice(0, 2) : CRENEAUX;
    for (const [heureDebut, heureFin] of slots) {
      await prisma.disponibilite.upsert({
        where: {
          date_heureDebut_heureFin: {
            date: jourUtc(day),
            heureDebut,
            heureFin,
          },
        },
        update: { estDisponible: true },
        create: {
          date: jourUtc(day),
          heureDebut,
          heureFin,
          estDisponible: true,
        },
      });
    }
  }

  console.log(`Seed OK — admin ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
