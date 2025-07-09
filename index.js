const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const nodemailer = require("nodemailer");


const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const route = express.Router();
const port = process.env.PORT || 5001;

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: 'ncee3333@gmail.com',
    pass: 'ofgr unup evtn hbbt' // Consider using process.env in production
  },
  secure: true,
});


app.use("/v1", route);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Existing simple route
route.get("/simple-get", (req, res) => {
  res.send("here");
});

// New Pokémon route
route.get("/pokemon/:name", async (req, res) => {
  const pokemonName = req.params.name.toLowerCase();

  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );

    const pokemonData = {
      name: response.data.name,
      id: response.data.id,
      height: response.data.height,
      weight: response.data.weight,
    };

    res.json(pokemonData);
  } catch (error) {
    res.status(404).send({ error: "Pokémon not found!" });
  }
});

route.post("/send-email", (req, res) => {
  const { to, subject, text } = req.body;
  console.log(to + " " + subject + " " + text);

  const mailData = {
    from: "ncee3333@gmail.com",
    to,
    subject,
    text,
    html: `<p>${text}</p>`,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send({ message: "Failed to send email" });
    }
    res.status(200).send({ message: "Mail sent", message_id: info.messageId });
  });
});

route.get("/send-email", (req, res) => {
  console.log("Server is ready to send email");
  res.send("This route only works with POST requests. Use Postman or curl.");
});

