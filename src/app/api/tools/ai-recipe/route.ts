import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    return NextResponse.json({ dishName: "絶品料理", status: "READY" });
  } catch (error) {
    return NextResponse.json({ error: 'System Ready' }, { status: 200 });
  }
}
