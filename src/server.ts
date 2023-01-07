import "dotenv/config";
import express, { json } from "express";
import { router } from "./api/routes/router";
import cors from "cors";

const app = express();
const PORT = 8888;

app.use(cors());
app.use(json());
app.use(router);

app.listen(PORT, () => console.log(`\nServer is running in port ${PORT}\n`));
