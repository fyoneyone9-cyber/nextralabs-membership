import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: "NextraLabs",
    short_name: "NextraLabs",
    description: "NextraLabs AI Tool Store - 業務効率化・自動化兵器群",
    start_url: "/",
    display: "standalone",
    background_color: "#050507",
    theme_color: "#5845e0",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };

  return NextResponse.json(manifest);
}
