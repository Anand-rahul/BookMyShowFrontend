import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const API_BASE_URL = "http://localhost:8080";
const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { userName, password } = await req.json();

    // Fetch user from your API
    const userResponse = await fetch(
      `${API_BASE_URL}/users/username/${userName}`
    );

    if (!userResponse.ok) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await userResponse.json();

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password || "");

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set the token in an HTTP-only cookie
    const response = NextResponse.json({ user });
    response.cookies.set("jwtToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600, // 1 hour
    });

    return response;
  } catch (error) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
