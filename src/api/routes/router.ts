import { Router } from "express";
import { Authenticated } from "../../useCases/auth/AuthenticatedUser";
import { userRouter } from "./userRouter";

export const router = Router();

router.get("/", (req, res) =>
  res.json({ message: "Bem vindo a API Post it!" })
);
router.use("/users", userRouter);
router.post("/auth", Authenticated);
