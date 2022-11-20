import { Request, Response } from "express";
import { UserModel } from "../../models/UserModel";
import { prisma } from "../../services/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function Authenticated(req: Request, res: Response) {
  const { email, password }: UserModel = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Campos obrigatórios" });

  try {
    const userSearched = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        type: true,
      },
    });

    if (!userSearched) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const passwordMatch = await compare(password, userSearched.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Email ou senha incorretos" });
    }

    const key = process.env.KEY!;

    const token = sign({}, key, {
      subject: userSearched.id,
      expiresIn: "1d",
    });

    return res.status(200).json({
      token,
      user: {
        type: userSearched.type,
        id: userSearched.id,
        name: userSearched.name,
        email: userSearched.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno" });
  }
}
