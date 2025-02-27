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
        // Retrieve Stripe customers based on email
        const customers = await stripe.customers.list({ email });

        if (customers.data.length === 0) {
            return res.json({ success: false, message: "No customer found with this email." });
        }

        const customerId = customers.data[0].id;

        // Check for successful payments (one-time charges)
        const charges = await stripe.paymentIntents.list({
            customer: customerId,
            limit: 10, // Fetch recent payments
        });

        const successfulCharge = charges.data.find(charge => charge.status === "succeeded");

        if (successfulCharge) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false, message: "No successful payments found." });
        }
    } catch (error) {
        console.error("Stripe API Error:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
}
