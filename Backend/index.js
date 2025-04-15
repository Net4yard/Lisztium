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
  mode: "sandbox",
  client_id:
    "AfI7cPtMCdFdXb52vxto7Ec6Ojy-yUxnXVKzJtGY0cIlhGEmZuya0HUE6zkLT6I7xTr67EpGdPWjbX7k",
  client_secret:
    "EJh4ZhIREgUJHeWXUqpHT0-jycjeLY74Ohz5e3pKB3gvpYrP-3sDYzBbxTamaqRg9Yru8ESSWIO0G9Aj",
});

app.post("/pay", (req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Red Sox Hat",
              sku: "001",
              price: "25.00",
              currency: "EUR",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "EUR",
          total: "25.00",
        },
        description: "Hat for the best team ever",
      },
    ],
  };
  app.get("/success", (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "EUR",
            total: "25.00",
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log(JSON.stringify(payment));
          res.send("Success");
        }
      }
    );
  });
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
});
app.get("/cancel", (req, res) => res.send("Cancelled"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
