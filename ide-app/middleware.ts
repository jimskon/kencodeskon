import { NextRequest } from "next/server";
import { updateSession, logout } from "./lib";

export async function middleware(request: NextRequest) {
  try{
    return await updateSession(request);
  } catch (err) {
    console.log("cookies expired")
    return await logout();
  }
}