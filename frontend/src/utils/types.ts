import type { JwtPayload } from "jwt-decode";

export type DecodedToken = JwtPayload & {
  exp?: number;
};

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  type: string;
  organisation: number | null;
  organisation_name: string | null;
};

export type Organisation = {
  id: number;
  name: string;
  join_token: string;
};
