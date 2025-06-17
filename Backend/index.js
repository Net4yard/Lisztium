console.error = function() {}; // Letiltja az error üzeneteket
console.warn = function() {};  // Letiltja a warning üzeneteket

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
    "ATkAnoxZLye22E-qVoBJeYwqOvBf3QkK0lsmNb2q54saeQKfJtr-ONj5hO1SC1KLgPi6MdKIrIFc5IIR",
  client_secret:
    "EHmqiOsZm1ZUJdpsMOxgrXXkbxHSujMyG2rZUYcKeZiFN4sGo_fhJm0itqtPl51q2ZTO_ZqlH6Cdtrcm",
});

app.post("/pay", (req, res) => {
  const cart = req.body.cart;
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  // Átalakítás PayPal formátumra
  const items = cart.map((item) => ({
    name: item.name,
    sku: item.name.replace(/\s/g, "_"),
    price: (item.price / 100).toFixed(2), // ha Ft-ot használsz, váltsd át EUR-ra!
    currency: "EUR",
    quantity: item.quantity,
  }));

  // Összesítés
  const total = items
    .reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    )
    .toFixed(2);

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
        amount: { currency: "EUR", total },
        description: "Lisztium purchase",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
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

