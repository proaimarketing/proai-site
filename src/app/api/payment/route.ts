import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

// create prisma instence
const prisma = new PrismaClient();

// connect stripe via secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// create payment url to redirect user payment page
export async function POST(req: Request) {
  try {
    const { name, price, currency = "usd", email } = await req.json();

    const existUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existUser?.paymentStatus) {
      return NextResponse.json(
        { message: "you have already a membership!" },
        { status: 400 }
      );
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: name,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
      metadata: { email, name },
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
