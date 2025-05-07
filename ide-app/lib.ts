import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Docker } from "./evaluator/docker";

const secretKey = process.env.ENCRYPTION_KEY;
const key = new TextEncoder().encode(secretKey);
const shelfLife = 1000; //seconds
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 min from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(formData: FormData) {
  // Verify credentials && get the user

  const user = { email: formData.get("email"), password: formData.get("password") };
  
  var docker = new Docker;
  var hashid = await docker.initialize();
  
  // Create the session
  const expires = new Date(Date.now() + shelfLife * 1000);
  const session = await encrypt({ user, expires, hashid });

  // Save the session in a cookie
  var cook = await cookies()
  cook.set("session", session, { expires, httpOnly: true });
}

export async function logout() {
  const cook = await cookies();
  const session = cook.get("session")?.value;
  if (session) {
    try {
      // Decrypt session to get docker hashid
      const payload = await decrypt(session);
      if (payload.hashid) {
        const docker = new Docker();
        docker.setParams(payload.hashid);  // using "python" as the language per login
        docker.cleanup();
      }
    } catch (err) {
      console.error("Error cleaning up docker container:", err);
    }
  }
  // Destroy the session cookie
  cook.set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  var cook = await cookies()
  const session = cook.get("session")?.value;
  if (!session) return null;
  try{
    const decrypted = await decrypt(session);
    return decrypted;
  } catch (err) {
    console.log("Cookie fetch failed with error: ", err)
    // const cook = await cookies();
    // cook.set("session", "", { expires: new Date(0) });
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + shelfLife * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}