import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  const token = req.cookies.get("jwtToken")?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      userName: string;
      email: string;
    };

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: decoded.id,
        userName: decoded.userName,
        email: decoded.email,
      },
    });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }
}
