import { prisma } from "../../services/prisma";

export function consumptionController() {
  async function createConsumptionByCSV() {
    return await prisma.consumptionCSV.create({
      data: {
        createdAt: new Date().toISOString(),
      },
    });
  }

  async function updateConsumptionCSV(
    id: string,
    m_pa_p: number,
    m_pa_fp: number,
    m_pr_p: number,
    m_pr_fp: number
  ) {
    return await prisma.consumptionCSV.update({
      where: {
        id,
      },
      data: {
        m_pa_p,
        m_pa_fp,
        m_pr_p,
        m_pr_fp,
      },
    });
  }

  async function addWristInCSV(
    pa_p: number,
    pa_fp: number,
    pr_p: number,
    pr_fp: number
  ) {
    return await prisma.wrist.create({
      data: {
        pa_p,
        pa_fp,
        pr_p,
        pr_fp,
      },
    });
  }

  return { createConsumptionByCSV, updateConsumptionCSV, addWristInCSV };
}
