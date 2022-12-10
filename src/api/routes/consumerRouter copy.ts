import { Request, Response, Router } from "express";
import { Readable } from "stream";
import readline from "readline";

import { multer } from "../../services/multer";
import { prisma } from "../../services/prisma";

export const consumerRouter = Router();

consumerRouter.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Rota dos consumos" });
});

consumerRouter.post(
  "/file",
  multer.single("file"),
  async (req: Request, res: Response) => {
    // pega o arquivo CSV da requisição através do MULTER
    const { buffer } = req.file!;

    // transformar em um arquivo manipulável
    const readableFile = new Readable();
    readableFile.push(buffer);
    readableFile.push(null);

    // separa o arquivo em linhas
    const readableLines = readline.createInterface({
      input: readableFile,
    });

    const date = new Date().toISOString();

    try {
      // const csv = await prisma.consumerCSV.create({
      //   data: {
      //     createdAt: date,
      //   },
      // });

      let count = 0;
      let lines = {
        pulso_ativo_ponta: 0,
        pulso_ativo_fora_ponta: 0,
        pulso_reativo_ponta: 0,
        pulso_reativo_fora_ponta: 0,
      };

      const data = {
        header: {
          m_pa_p: 0,
          m_pa_fp: 0,
          m_pr_p: 0,
          m_pr_fp: 0,
        },
        body: {} as {
          id: number;
          pa_p: number;
          pa_fp: number;
          pr_p: number;
          pr_fp: number;
        }[],
      };
      for await (let line of readableLines) {
        const arr = line.split(",");

        if (count <= 1) continue;

        lines.pulso_ativo_ponta += +arr[2];
        lines.pulso_ativo_fora_ponta += +arr[3];
        lines.pulso_reativo_ponta += +arr[4];
        lines.pulso_reativo_fora_ponta += +arr[5];

        data.body.push({
          id: count,
          pa_p: +arr[2],
          pa_fp: +arr[3],
          pr_p: +arr[4],
          pr_fp: +arr[5],
        });
        count++;
      }

      data.header.m_pa_p = lines.pulso_ativo_ponta / 900;
      data.header.m_pa_fp = lines.pulso_ativo_fora_ponta / 900;
      data.header.m_pr_p = lines.pulso_reativo_ponta / 900;
      data.header.m_pr_fp = lines.pulso_reativo_fora_ponta / 900;

      // try {
      //   await prisma.consumerCSV.update({
      //     where: {
      //       id: csv.id,
      //     },
      //     data: {
      //       m_pa_p: lines.pulso_ativo_ponta / 900,
      //       m_pa_fp: lines.pulso_ativo_fora_ponta / 900,
      //       m_pr_p: lines.pulso_reativo_ponta / 900,
      //       m_pr_fp: lines.pulso_reativo_fora_ponta / 900,
      //     },
      //   });
      // } catch (error) {
      //   console.log({ message: "Error no update", error });
      // }

      // console.log({
      //   media_pulso_ativo: {
      //     ponta: lines.pulso_ativo_ponta / 900,
      //     fora_ponta: lines.pulso_ativo_fora_ponta / 900,
      //   },
      //   media_pulso_reativo: {
      //     ponta: lines.pulso_reativo_ponta / 900,
      //     fora_ponta: lines.pulso_reativo_fora_ponta / 900,
      //   },
      // });

      // console.log(data);

      return res.status(200).json({ message: "Arquivo enviado com sucesso" });
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  }
);
