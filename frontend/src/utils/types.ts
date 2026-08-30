import type { JwtPayload } from "jwt-decode";

export type DecodedToken = JwtPayload & {
  exp?: number;
};
