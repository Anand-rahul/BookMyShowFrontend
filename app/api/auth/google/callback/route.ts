import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = "http://localhost:3000/api/auth/google/callback";
const JWT_SECRET = process.env.JWT_SECRET!;
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com"
    : "http://localhost:3000";

async function getGoogleOAuthTokens(code: string) {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(values).toString(),
    });

    if (!response.ok) {
      throw new Error(`Failed to get tokens: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting Google OAuth tokens:", error);
    throw error;
  }
}

async function getGoogleUser(id_token: string, access_token: string) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting Google user info:", error);
    throw error;
  }
}

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=no_code", BASE_URL));
    }

    const { id_token, access_token } = await getGoogleOAuthTokens(code);
    const googleUser = await getGoogleUser(id_token, access_token);

    // Structure the user data to match our User type
    const user = {
      id: googleUser.id,
      userName: googleUser.name,
      email: googleUser.email,
    };

    const token = jwt.sign(
      {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const response = NextResponse.redirect(new URL("/", BASE_URL));
    response.cookies.set("jwtToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600, // 1 hour
    });

    return response;
  } catch (error) {
    console.error("Error during Google authentication:", error);
    return NextResponse.redirect(
      new URL("/login?error=authentication_failed", BASE_URL)
    );
  }
}
