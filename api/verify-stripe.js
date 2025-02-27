import Stripe from \"stripe\";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== \"POST\") {
        return res.status(405).json({ error: \"Method Not Allowed\" });
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: \"Email is required\" });
    }

    try {
        // Search for payments made with the provided email
        const payments = await stripe.paymentIntents.list({
            limit: 10,
        });

        const matchedPayments = payments.data.filter(payment =>
            payment.charges.data.some(charge => charge.billing_details.email === email && charge.paid)
        );

        if (matchedPayments.length > 0) {
            return res.json({ success: true, message: \"Payment found and verified.\" });
        } else {
            return res.json({ success: false, message: \"No payment found for this email.\" });
        }
    } catch (error) {
        console.error(\"Stripe API Error:\", error);
        res.status(500).json({ success: false, message: \"Server error. Please try again.\" });
    }
};
