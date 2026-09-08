const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.DATABASE_URL;

let prisma;
try {
  if (connectionString) {
    const adapter = new PrismaPg({ connectionString });
    prisma = new PrismaClient({ adapter });
  } else {
    prisma = new PrismaClient();
  }
} catch (error) {
  console.error("Error initializing Prisma Client:", error.message);
  prisma = new PrismaClient();
}

module.exports = prisma;
