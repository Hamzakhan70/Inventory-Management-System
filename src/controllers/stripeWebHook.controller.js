import Stripe from "stripe";
import prisma from '../prisma/client.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  console.log('Stripe Webhook received');
  const sig = req.headers["stripe-signature"];
  console.log('Stripe signature:', sig);
console.log('Raw body is Buffer:', Buffer.isBuffer(req.body));

  console.log('Webhook secret exists:', !!process.env.STRIPE_WEBHOOK_SECRET);
  
  let event;

  try {
    if (!req.body) {
      console.error('No raw body found in request');
      return res.status(400).send('No raw body found in request');
    }
    if (!sig) {
      console.error('No stripe-signature header found');
      return res.status(400).send('No stripe-signature header found');
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET environment variable is not set');
      return res.status(500).send('Webhook secret not configured');
    }

    event = stripe.webhooks.constructEvent(
      req.body, // need raw body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    console.error('Error details:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Event type:', event.type);
  
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log('Session data:', session);
    
    // Check if orderId exists in metadata
    if (!session.metadata || !session.metadata.orderId) {
      console.error('No orderId found in session metadata');
      return res.status(400).json({ error: 'No orderId in metadata' });
    }

    const orderId = Number(session.metadata.orderId);
    console.log('Processing orderId:', orderId);

    try {
      // ✅ Update payment + order status
      const paymentUpdate = await prisma.payment.updateMany({
        where: { orderId },
        data: { status: "SUCCESS",stripePaymentIntentId: session.payment_intent }
        
      });
      console.log('Payment update result:', paymentUpdate);

      const orderUpdate = await prisma.order.update({
        where: { id: orderId },
        data: { status: "CONFIRMED" },
      });
      console.log('Order update result:', orderUpdate);
    } catch (error) {
      console.error('Database update error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  res.json({ received: true });
};
