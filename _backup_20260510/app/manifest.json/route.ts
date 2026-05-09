import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: "NextraLabs AI Tool Store",
    short_name: "NextraLabs",
    description: "NextraLabs AI Tool Store - 業務効率化・自動化兵器群",
    start_url: "/",
    display: "standalone",
    background_color: "#050507",
    theme_color: "#5845e0",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };

  return NextResponse.json(manifest);
}
