import { Request, Response } from "express";
import { hash } from "bcryptjs";
import { prisma } from "../../api/services/prisma";
import { UserModel } from "../../models/UserModel";

export async function createUser(req: Request, res: Response) {
  let { type = "user", name, email, password, campus }: UserModel = req.body;

  // Validação se criador é admin
  const { id } = req.params;

  if (!id) {
    return res.status(401).json({ message: "Não autenticado" });
  }

  try {
    let creator = await prisma.user.findFirst({
      where: { id: id },
      select: { type: true },
    });

    if (!creator)
      if (id === process.env.KEY_ADMIN) {
        creator = { type: "admin" };
      } else return res.status(401).json({ message: "Não autenticado" });

    if (creator?.type === "admin") {
    } else {
      return res.status(403).json({ message: "Não autorizado" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Erro interno" });
  }

  // Validação dos campos
  const formatEmailValid = /\S+@\S+\.\S+/;

  if (!name || !email || !password || !campus)
    return res.status(400).json({ message: "Campos obrigatórios" });

  if (!formatEmailValid.test(email))
    return res.status(400).json({ message: "Email inválido" });

  try {
    const checkExistingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (checkExistingEmail)
      return res.status(400).json({ message: "Email já cadastrado" });
  } catch (error) {
    return res.status(500).json({ message: "Erro interno" });
  }

  if (password.length < 6)
    return res.status(400).json({ message: "Senha inválida" });

  const passwordHash = await hash(password, 6);

  // Criação do novo usuário
  try {
    await prisma.user.create({
      data: { type, name, email, password: passwordHash, campus },
    });

    return res.status(201).json({ message: "Usuário cadastrado com sucesso." });
  } catch (error) {
    console.log(error);
    return res.status(502).json({ message: "Erro interno. Tente novamente" });
  }
}
