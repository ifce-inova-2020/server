import { Router } from "express";
import { Authenticated } from "../../stories/auth/AuthenticatedUser";
import { consultRouter } from "./consultRouter";
import { consumptionRouter } from "./consumptionRouter";
import { userRouter } from "./userRouter";

export const router = Router();

router.get("/", (req, res) =>
  res.json({
    message: "Bem vindo(a) a API do Projeto Inova 2022 do IFCE Campus Aracati.",
  })
);
router.use("/user", userRouter);
router.use("/c", consultRouter);
router.use("/send", consumptionRouter);
router.post("/auth", Authenticated);
