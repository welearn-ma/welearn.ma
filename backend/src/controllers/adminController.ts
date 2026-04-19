import { Request, Response } from "express";
import {
  getBearerToken,
  validateAdminAccessToken,
} from "../lib/adminAuth";

type AdminSessionResponse =
  | {
      success: true;
      email: string;
    }
  | {
      success: false;
      message: string;
    };

export async function getAdminSession(
  req: Request,
  res: Response<AdminSessionResponse>,
) {
  const token = getBearerToken(req.header("authorization"));
  const access = await validateAdminAccessToken(token);

  if (!access.ok) {
    if (access.reason === "not_admin") {
      return res.status(403).json({
        success: false,
        message: "Compte non autorise pour le dashboard admin.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Session admin invalide ou expiree.",
    });
  }

  return res.status(200).json({
    success: true,
    email: access.email,
  });
}
