import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing structures to avoid duplicate key conflicts
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.farm.deleteMany({});
  await prisma.user.deleteMany({});

  // Create base Mock Farmer
  const farmer = await prisma.user.create({
    data: {
      email: 'farmer@farmlive.bd',
      name: 'Anisur Rahman',
      phone: '+8801711223344',
      role: 'FARMER',
    },
  });

  console.log(`✅ Created Farmer User: ${farmer.name}`);

  // Seed Bogra Hub (Coordinates: 24.8481° N, 89.3730° E)
  const farmBograId = 'bogra-sector-04';
  await prisma.$executeRaw`
    INSERT INTO "Farm" (id, "ownerId", name, district, "hlsUrl", metadata, location, "updatedAt")
    VALUES (
      ${farmBograId},
      ${farmer.id},
      'Bogra Organic Poultry Sector 04',
      'Bogra',
      'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      '{"temperature": 24.5, "ph": 6.8}'::jsonb,
      ST_GeographyFromText('SRID=4326;POINT(89.3730 24.8481)'),
      NOW()
    )
  `;

  await prisma.product.createMany({
    data: [
      { farmId: farmBograId, name: 'Organic Broiler Chicken', price: 220, unit: 'KG', stock: 150 },
      { farmId: farmBograId, name: 'Farm Fresh Brown Eggs', price: 145, unit: 'PIECE', stock: 1200 },
    ],
  });

  // Seed Mymensingh Hub (Coordinates: 24.7471° N, 90.4203° E)
  const farmMymId = 'mymensingh-sector-02';
  await prisma.$executeRaw`
    INSERT INTO "Farm" (id, "ownerId", name, district, "hlsUrl", metadata, location, "updatedAt")
    VALUES (
      ${farmMymId},
      ${farmer.id},
      'Mymensingh Rui-Katla Wetland Hub',
      'Mymensingh',
      'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      '{"temperature": 22.1, "ph": 7.4}'::jsonb,
      ST_GeographyFromText('SRID=4326;POINT(90.4203 24.7471)'),
      NOW()
    )
  `;

  await prisma.product.createMany({
    data: [
      { farmId: farmMymId, name: 'Freshwater Rui Fish (Medium)', price: 380, unit: 'KG', stock: 80 },
      { farmId: farmMymId, name: 'Premium Katla Catch', price: 450, unit: 'KG', stock: 45 },
    ],
  });

  console.log('🏁 Seeding execution successful. Bogra and Mymensingh geo-sectors initialized.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
