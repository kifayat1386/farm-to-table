import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTest() {
  console.log('🧪 Starting End-to-End Checkout Test...');

  // 1. Get a Farmer and a Farm
  const farm = await prisma.farm.findFirst({
    where: { district: 'Bogra' },
    include: { products: true },
  });

  if (!farm || farm.products.length === 0) {
    console.error('❌ Could not find Bogra farm or products. Did you seed the DB?');
    process.exit(1);
  }

  // 2. Create a Mock Consumer User
  let consumer = await prisma.user.findFirst({ where: { email: 'consumer@test.com' } });
  if (!consumer) {
    consumer = await prisma.user.create({
      data: {
        email: 'consumer@test.com',
        name: 'Dhaka Consumer',
        role: 'CONSUMER'
      }
    });
  }

  // 3. Prepare Checkout Payload
  // Dhaka Coordinates (approx 175 km straight line from Bogra)
  const payload = {
    userId: consumer.id,
    farmId: farm.id,
    userLat: 23.8103,
    userLng: 90.4125,
    items: [
      {
        productId: farm.products[0].id,
        quantity: 2 // 2 units
      }
    ]
  };

  const expectedItemTotal = farm.products[0].price * 2;
  console.log(`\n📦 Submitting Order for 2x ${farm.products[0].name} (৳${farm.products[0].price} each)`);
  console.log(`💸 Expected Items Total: ৳${expectedItemTotal}`);

  // 4. Hit the REST API Endpoint
  console.log('\n🚀 Triggering POST /v1/checkout/accrual...');
  const res = await fetch('http://localhost:3002/v1/checkout/accrual', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('❌ Transaction Failed:', data);
    process.exit(1);
  }

  // 5. Verify the Response
  console.log('\n✅ Transaction Successful! Accrual Breakdown:');
  console.log('--------------------------------------------------');
  console.log(`📌 Order ID: ${data.id}`);
  console.log(`🚚 Dynamic Logistics Fee: ৳${data.logisticsFee}`);
  console.log(`🏢 Platform Support (10%): ৳${data.platformFee}`);
  console.log(`👨‍🌾 Farmer Payout: ৳${data.vendorPayout}`);
  console.log('--------------------------------------------------');

  const mathCheck = data.platformFee + data.vendorPayout;
  if (Math.abs(mathCheck - expectedItemTotal) > 0.01) {
    console.error(`❌ Math Integrity Failure! Split total ${mathCheck} does not equal item total ${expectedItemTotal}`);
  } else {
    console.log('🔒 Accrual Split Integrity Verified.');
  }
}

runTest()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
