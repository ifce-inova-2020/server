import { Request, Response } from "express";
import { hash } from "bcryptjs";
import { prisma } from "../../api/middlewares/prisma/PrismaClient";
import { UserModel } from "../../core/models/UserModel";

export async function createUser(req: Request, res: Response) {
  let { type = "user", name, email, password, campus }: UserModel = req.body;

  const formatEmailValid = /\S+@\S+\.\S+/;

  if (!name || !email || !password || !campus)
    return res.status(400).json({ message: "Campos obrigatórios" });

  if (!formatEmailValid.test(email))
    return res.status(400).json({ message: "Email inválido" });

  try {
    const checkIfEmailAlreadyExists = await prisma.user.findUnique({
      where: { email },
    });
    if (checkIfEmailAlreadyExists)
      return res.status(400).json({ message: "Email já cadastrado" });
  } catch (error) {
    return res.status(502).json({ message: "Erro externo. Tente novamente." });
  }

  if (password.length < 8)
    return res.status(400).json({ message: "Senha inválida" });

  const passwordHash = await hash(password, 8);

  try {
    await prisma.user.create({
      data: { type, name, email, password: passwordHash, campus },
    });

    return res.status(201).json({ message: "Usuário cadastrado com sucesso." });
  } catch (error) {
    console.log(error);
    return res.status(502).json({ message: "Erro externo. Tente novamente" });
  }
}
