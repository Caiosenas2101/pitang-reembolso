import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { UserRole } from "../constants/enums";
import { env } from "../config/env";

export type JwtPayload = {
  sub: string;
  email: string;
  perfil: UserRole;
};

export function signToken(payload: JwtPayload) {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"]
  };

  return jwt.sign(payload, env.jwtSecret, {
    ...options
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
