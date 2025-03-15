import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

// create prisma instence
const prisma = new PrismaClient();

// connect stripe via secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// handle webhook request and update user membership
export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    const event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.metadata?.email;
        const subscriptionId = session.subscription as string;
        let membershipDetails = {};
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
          );

          // Extract membership details
          membershipDetails = {
            membershipId: subscription.id,
            status: subscription.status,
            planId: subscription.items.data[0]?.price.id, // Stripe Price ID
            planName: subscription.items.data[0]?.price.product, // Stripe Product ID
            amount: subscription.items.data[0]?.price.unit_amount, // Convert cents to dollars
            currency: subscription.items.data[0]?.price.currency,
            interval: subscription.items.data[0]?.price.recurring?.interval, // monthly/yearly
          };
        } else {
          membershipDetails = {
            membershipId: session.id,
            status: "completed",
            planId: Math.floor(
              1000000000 + Math.random() * 9000000000
            ).toString(),
            currency: session.currency,
            interval: "one-time",
            planName: session?.metadata?.name,
            amount: session.amount_total ? session.amount_total / 100 : 0,
          };
        }
        await prisma.user.update({
          where: { email: email },
          data: {
            membership: JSON.stringify(membershipDetails),
            paymentStatus: true,
          },
        });
        break;

      case "checkout.session.async_payment_succeeded":
        await prisma.user.update({
          where: { email: email },
          data: {
            membership: JSON.stringify({ status: "pending" }),
            paymentStatus: false,
          },
        });
        break;

      case "checkout.session.expired":
        await prisma.user.update({
          where: { email: email },
          data: {
            membership: JSON.stringify({ status: "expired" }),
            paymentStatus: false,
          },
        });
        break;

      case "payment_intent.payment_failed":
        await prisma.user.update({
          where: { email: email },
          data: {
            membership: JSON.stringify({ status: "failed" }),
            paymentStatus: false,
          },
        });
        break;

      default:
        await prisma.user.update({
          where: { email: email },
          data: {
            membership: JSON.stringify({ status: "not-complete" }),
            paymentStatus: false,
          },
        });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
