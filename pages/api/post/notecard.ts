// todo possibly delete this no longer needed route
import type { NextApiRequest, NextApiResponse } from "next";

export default function receiveNotecardData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(req.body);
}
