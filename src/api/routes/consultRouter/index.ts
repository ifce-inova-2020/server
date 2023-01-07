import { Router } from "express";

export const consultRouter = Router();

consultRouter.get("/last-seven-days", (req, res) => {
  res.json({ message: "Últimos sete dias." });
});
