import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);

export async function generateToken(
  payload: object,
  expiresIn: string = "7d",
): Promise<string> {
  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET);
  return jwt;
}

export async function verifyToken<T>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as T;
  } catch (error) {
    console.error("JWT Verification failed:", error);
    return null;
  }
}
