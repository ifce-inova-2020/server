import { Request, Response } from "express";
import { prisma } from "../../api/middlewares/prisma/PrismaClient";

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const isValidUser = await prisma.user.findUnique({ where: { id } });

    if (!isValidUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
  } catch (error) {
    return res.status(502).json({ message: "Erro externo. Tente novamente." });
  }

  try {
    await prisma.user.delete({ where: { id } });

    return res.status(200).json({ message: `Usuário excluído com sucesso.` });
  } catch (err) {
    console.log(err);
    return res.status(502).json({ message: "Erro externo. Tente novamente." });
  }
}
