import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        // Retrieve the customer by email
        const customers = await stripe.customers.list({ email });

        if (customers.data.length === 0) {
            return res.json({ success: false, message: "No payment or subscription found for this email." });
        }

        const customerId = customers.data[0].id;

        // Check for active subscriptions
        const subscriptions = await stripe.subscriptions.list({ customer: customerId });
        const activeSubscription = subscriptions.data.find(sub => sub.status === "active");

        if (activeSubscription) {
            return res.json({ success: true, message: "Active subscription found." });
        }

        // If no active subscription, check for a successful one-time payment
        const payments = await stripe.paymentIntents.list({
            customer: customerId,
            limit: 10, // Check recent payments
        });

        const successfulPayment = payments.data.find(payment => payment.status === "succeeded");

        if (successfulPayment) {
            return res.json({ success: true, message: "Successful one-time payment found." });
        } else {
            return res.json({ success: false, message: "No valid subscription or one-time payment found." });
        }
    } catch (error) {
        console.error("Stripe API Error:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};
