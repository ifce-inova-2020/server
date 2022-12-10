import { Request, Response, Router } from "express";
import { Readable } from "stream";
import readline from "readline";
import fs from "fs";

import { multer } from "../../services/multer";
import { prisma } from "../../services/prisma";

export const consumptionRouter = Router();

consumptionRouter.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Rota dos consumos" });
});

consumptionRouter.post(
  "/file",
  multer.single("file"),
  async (req: Request, res: Response) => {
    // pega o arquivo CSV da requisição através do MULTER
    const { buffer } = req.file!;

    if (!buffer)
      return res.status(400).json({ message: "Arquivo inexistente" });

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
      const csv = await prisma.consumptionCSV.create({
        data: {
          createdAt: date,
        },
      });

      let count = -1;
      let lines = {
        pulso_ativo_ponta: 0,
        pulso_ativo_fora_ponta: 0,
        pulso_reativo_ponta: 0,
        pulso_reativo_fora_ponta: 0,
      };

      let data = {
        header: {
          t_pa_p: 0,
          t_pa_fp: 0,
          t_pr_p: 0,
          t_pr_fp: 0,
        },
        body: [] as {}[],
      };

      for await (let line of readableLines) {
        const arr = line.split(",");

        count++;
        if (count < 1 || count > 900) continue;

        lines.pulso_ativo_ponta += +arr[2];
        lines.pulso_ativo_fora_ponta += +arr[3];
        lines.pulso_reativo_ponta += +arr[4];
        lines.pulso_reativo_fora_ponta += +arr[5];

        // console.log({
        //   id: count,
        //   pa_p: +arr[2],
        //   pa_fp: +arr[3],
        //   pr_p: +arr[4],
        //   pr_fp: +arr[5],
        // });

        data.body.push({
          id: +arr[1],
          pa_p: +arr[2],
          pa_fp: +arr[3],
          pr_p: +arr[4],
          pr_fp: +arr[5],
        });
      } // FIM FOR

      fs.writeFile("data.json", JSON.stringify(data.body), (err) => {
        if (err) throw err;
        return console.log("Success");
      });
      data.header.t_pa_p = lines.pulso_ativo_ponta;
      data.header.t_pa_fp = lines.pulso_ativo_fora_ponta;
      data.header.t_pr_p = lines.pulso_reativo_ponta;
      data.header.t_pr_fp = lines.pulso_reativo_fora_ponta;

      console.log(data.header);
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

      return res.status(200).json({ message: "Arquivo enviado com sucesso" });
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  }
);
