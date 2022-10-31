import { Request, Response } from "express";
import { hash } from "bcryptjs";

import { prisma } from "../../api/middlewares/prisma/PrismaClient";
import { UserModel } from "../../core/models/UserModel";

export async function updateUser(req: Request, res: Response) {
  const { id, name, email, password, campus }: UserModel = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { id } });

    if (!userExists)
      return res.status(404).json({ message: "Usuário não encontrado." });
  } catch (error) {
    return res.status(502).json({ message: "Erro externo. Tente novamente." });
  }

  const newUser: any = new Object();

  if (name) {
    newUser.name = name;
  }

  if (email) {
    newUser.email = email;
  }

  if (campus) {
    newUser.campus = campus;
  }

  if (password) {
    if (password.length < 30 && password.length > 5) {
      const passwordHash = await hash(password, 6);

      newUser.password = passwordHash;
    } else return res.status(400).json({ message: "Erro. Campos inválidos" });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: newUser,
      select: { name: true, email: true, type: true, campus: true },
    });

    return res.status(201).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno" });
  }
}
