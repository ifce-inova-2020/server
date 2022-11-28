import { Request, Response, Router } from "express";
import { Readable } from "stream";
import readline from "readline";

import { multer } from "../../services/multer";
import { prisma } from "../../services/prisma";

import { consumerController } from "../../stories/consumer/index";

const consumer = consumerController();

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

    let csv;
    let count = 0;
    let lines = {
      pulso_ativo_ponta: 0,
      pulso_ativo_fora_ponta: 0,
      pulso_reativo_ponta: 0,
      pulso_reativo_fora_ponta: 0,
    };

    try {
      csv = await consumer.createConsumerByCSV();
    } catch (err) {
      console.log(err);
    }

    console.log(csv);

    for await (let line of readableLines) {
      count++;
      const arr = line.split(",");

      if (count <= 1) continue;

      lines.pulso_ativo_ponta += +arr[2];
      lines.pulso_ativo_fora_ponta += +arr[3];
      lines.pulso_reativo_ponta += +arr[4];
      lines.pulso_reativo_fora_ponta += +arr[5];

      // console.log({
      //   date: arr[0],
      //   count: arr[1],
      //   pulso_ativo: {
      //     ponta: arr[2],
      //     fora_ponta: arr[3],
      //   },
      //   pulso_reativo: {
      //     ponta: arr[4],
      //     fora_ponta: arr[5],
      //   },
      // });
    }

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

    return res.status(200).json({ message: "Arquivo enviado com sucesso" });
  }
);
