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
        // Retrieve customer details based on email
        const customers = await stripe.customers.list({ email });

        if (customers.data.length === 0) {
            return res.json({ success: false, message: "No customer found with this email." });
        }

        const customerId = customers.data[0].id;

        // Check for active subscriptions
        const subscriptions = await stripe.subscriptions.list({ customer: customerId });

        const activeSubscription = subscriptions.data.find(sub => sub.status === "active");

        if (activeSubscription) {
            return res.json({ success: true, type: "subscription", message: "Active subscription found." });
        }

        // Check for one-time payment (for lifetime members)
        const charges = await stripe.paymentIntents.list({ customer: customerId });

        const successfulPayment = charges.data.find(
            charge => charge.status === "succeeded"
        );

        if (successfulPayment) {
            return res.json({ success: true, type: "lifetime", message: "One-time payment found." });
        }

        return res.json({ success: false, message: "No payment or subscription found for this email." });

    } catch (error) {
        console.error("Stripe API Error:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};
