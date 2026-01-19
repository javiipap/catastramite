import { SignJWT, jwtVerify } from "jose";
import { Resource } from "sst/resource";

const SECRET = new TextEncoder().encode(Resource.BETTER_AUTH_SECRET.value);

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
