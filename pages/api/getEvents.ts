import type { NextApiRequest, NextApiResponse } from "next";
import { fetchNotecardData } from "../../src/lib/notecardData";

// todo not currently  being used
export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const data = await fetchNotecardData(1637975066);
  res.status(200).json({ data });
}
