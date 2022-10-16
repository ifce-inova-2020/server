import express, { json } from "express";

const app = express();

app.use(json());

app.get("/", (req, res) => res.json({ message: "Bem vindo a API." }));

app.listen(2222, () => console.log("\nServer is running... \n"));
