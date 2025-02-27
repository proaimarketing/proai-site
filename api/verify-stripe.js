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
        // Fetch all customers and find one that matches the email
        let customers = await stripe.customers.list();
        let customer = customers.data.find(cust => cust.email === email);

        if (!customer) {
            // If no customer exists, let's check the PaymentIntents directly
            const payments = await stripe.paymentIntents.list();
            const successfulPayment = payments.data.find(payment =>
                payment.status === "succeeded" &&
                payment.charges.data.some(charge => charge.billing_details.email === email)
            );

            if (successfulPayment) {
                return res.json({ success: true, type: "lifetime", message: "One-time payment found." });
            }

            return res.json({ success: false, message: "No customer or payment found with this email." });
        }

        const customerId = customer.id;

        // Check if they have an active subscription
        const subscriptions = await stripe.subscriptions.list({ customer: customerId });

        const activeSubscription = subscriptions.data.find(sub => sub.status === "active");

        if (activeSubscription) {
            return res.json({ success: true, type: "subscription", message: "Active subscription found." });
        }

        // Check if they made a successful one-time payment
        const charges = await stripe.paymentIntents.list({ customer: customerId });

        const successfulPayment = charges.data.find(payment => payment.status === "succeeded");

        if (successfulPayment) {
            return res.json({ success: true, type: "lifetime", message: "One-time payment found." });
        }

        return res.json({ success: false, message: "No payment or subscription found for this email." });

    } catch (error) {
        console.error("Stripe API Error:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};
