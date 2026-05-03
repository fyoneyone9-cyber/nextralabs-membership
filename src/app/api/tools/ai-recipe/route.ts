import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    return NextResponse.json({ message: "API Initialized" });
  } catch (error) {
    return NextResponse.json({ error: "API Error" }, { status: 500 });
  }
}
