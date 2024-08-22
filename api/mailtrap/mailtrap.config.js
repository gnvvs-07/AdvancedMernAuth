import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config();

const TOKEN = process.env.TOKEN_MAILTRAP;
const ENDPOINT = process.env.ENDPOINT_MAILTRAP;

console.log("TOKEN:", TOKEN); // Check if the token is correctly loaded
console.log("ENDPOINT:", ENDPOINT); // Check if the endpoint is correctly loaded

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Mailtrap Test",
};
const recipients = [
  {
    email: "vchess007@gmail.com",
  }
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);
