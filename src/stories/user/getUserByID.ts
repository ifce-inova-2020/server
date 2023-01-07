import { Request, Response } from "express";
import { prisma } from "../../api/services/prisma";

export async function getUserByID(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { name: true, email: true },
    });

    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(502).json({ message: "Erro externo. Tente novamente." });
  }
}
