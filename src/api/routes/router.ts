import { Router } from "express";
import { Authenticated } from "../../stories/auth/AuthenticatedUser";
import { consultRouter } from "./consultRouter";
import { consumerRouter } from "./consumerRouter";
import { userRouter } from "./userRouter";

export const router = Router();

router.get("/", (req, res) =>
  res.json({
    message: "Bem vindo(a) a API do Projeto Inova 2022 do IFCE Campus Aracati.",
  })
);
router.use("/user", userRouter);
router.use("/c", consultRouter);
router.use("/consumer", consumerRouter);
router.post("/auth", Authenticated);
