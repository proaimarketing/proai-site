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
        // Retrieve all customers and filter manually
        const allCustomers = await stripe.customers.list({ limit: 100 });
        const customer = allCustomers.data.find(cust => cust.email === email);

        if (!customer) {
            return res.json({ success: false, message: "No active subscription found." });
        }

        // Check if customer has a valid subscription
        const subscriptions = await stripe.subscriptions.list({ customer: customer.id });

        const activeSubscription = subscriptions.data.find(sub => sub.status === "active");

        if (activeSubscription) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: "Subscription expired or inactive." });
        }
    } catch (error) {
        console.error("Stripe API Error:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};
