console.error = function () {}; // Letiltja az error üzeneteket
console.warn = function () {}; // Letiltja a warning üzeneteket

const express = require("express");
const app = express();
const port = 8080;
const paypal = require("paypal-rest-sdk");

const cors = require("cors");
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "Szia! Ez a lisztium weboldal backendje. Pontosan mit is keresel itt?"
  );
});
paypal.configure({
  mode: "live",
  client_id:
    "AZsazF1nl5HwwJvOhZJYyhhI_ygxi9fwaKlKQoTG-1PQSzzFpwdV1bK3-iW3LPLgjMvyYsQpcVS3J-4H",
  client_secret:
    "EEWFkNK76l5UqZIdA6h_M-j94RcWiw_tB27YddKnGAxmy4ppwYWmDAmS0WQ6MGN8x5C7ATd8MGq-Dxy2",
});

app.post("/pay", (req, res) => {
  const cart = req.body.cart;
  if (!Array.isArray(cart)) {
    return res.status(400).json({ error: "Cart is missing or invalid" });
  }

  // Átalakítás PayPal formátumra
  const items = cart.map((item) => ({
    name: item.name,
    sku: item.name.replace(/\s/g, "_"),
    price: Math.round(item.price), // JPY-hez egész szám kell!
    currency: "JPY",
    quantity: item.quantity,
  }));

  // Összesítés
  const total = items
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toString(); // JPY-hez string, tizedes NEM kell

  const create_payment_json = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: {
      return_url: "https://lisztium.com/success.html",
      cancel_url: "https://lisztium.com/",
    },
    transactions: [
      {
        item_list: { items },
        amount: { currency: "JPY", total },
        description: "Lisztium purchase",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Payment creation failed" });
    } else {
      // approval_url keresése
      const approvalUrl = payment.links.find(
        (link) => link.rel === "approval_url"
      );
      if (approvalUrl) {
        res.json({ approval_url: approvalUrl.href });
      } else {
        res.status(500).json({ error: "No approval_url found" });
      }
    }
  });
});
app.get("/cancel", (req, res) => res.send("Cancelled"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post("/send-email", async (req, res) => {
  const {
    name, furigana, email, instrument, plusone, age, school, videolinks,
    consent1, consent2, consent3, message
  } = req.body;

  const adminMailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `Application - ${name}`,
    text: `
New Application Received:

Name: ${name}
Furigana: ${furigana}
Email: ${email}
Instrument: ${instrument}
Optional plus one class: ${plusone}
Age: ${age}
Current School/Institution: ${school}
Video links: ${videolinks}

Consents:
- Processing Personal Info: ${consent1}
- Photos Usage Consent: ${consent2}
- Privacy Policy Accepted: ${consent3}

Message:
${message}
    `
  };

  // Jelentkezőnek visszaigazoló email
  const userMailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: "Your application to Lisztium Masterclasses has been received",
    text: `Dear ${name},

Thank you for your application to the Lisztium Masterclasses!
We have successfully received your submission and will get back to you shortly.

Best regards,
Lisztium Masterclasses Team`
  };

  try {
    await transporter.sendMail(adminMailOptions); // Adminnak
    await transporter.sendMail(userMailOptions);  // Jelentkezőnek
    res.json({ status: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", error: error.message });
  }
});