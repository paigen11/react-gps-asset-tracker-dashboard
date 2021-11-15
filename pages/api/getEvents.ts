import type { NextApiRequest, NextApiResponse } from "next";
import { fetchNotecardData } from "../../src/lib/notecardData";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const data = await fetchNotecardData();
  res.status(200).json({ data });
}
