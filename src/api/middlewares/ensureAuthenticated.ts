import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;

  if (!authToken) return res.status(401).json({ message: "Não autenticado." });

  const token = authToken.split(" ")[1];

  try {
    const decodedToken = verify(token, process.env.KEY!);

    let { id } = req.body;
    if (!id) ({ id } = req.params);

    if (id === decodedToken.sub) return next();
    console.log(id);
    console.log(decodedToken.sub);
    res.status(403).json({ message: "Não autorizado." });
  } catch (err) {
    res.status(500).json({ message: "Erro interno" });
  }
}
