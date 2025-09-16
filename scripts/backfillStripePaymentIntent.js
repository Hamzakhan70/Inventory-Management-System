// scripts/backfillStripePaymentIntent.js
import prisma from "../src/prisma/client.js";

async function backfill() {
  const payments = await prisma.payment.findMany({
    where: { stripePaymentIntentId: null }
  });

  for (const p of payments) {
    await prisma.payment.update({
      where: { id: p.id },
      data: { stripePaymentIntentId: "LEGACY_" + p.id } // or skip refunds for legacy
    });
  }
}

backfill().then(() => {
  console.log("✅ Backfill complete");
  process.exit(0);
});
