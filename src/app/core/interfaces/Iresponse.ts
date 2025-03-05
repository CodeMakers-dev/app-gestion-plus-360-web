import { Iuser } from "./Iuser";

export interface ApiResponse {
  success: boolean | null; // o el tipo que corresponda si sabes que es boolean
  message: string;
  code: number;
  response: Iuser;
}
