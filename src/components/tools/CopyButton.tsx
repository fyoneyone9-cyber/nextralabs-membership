'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export function CopyButton({ code, id }: { code: string, id: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => copyToClipboard(code)}
    >
      {copied === id ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
      {copied === id ? 'コピー済み' : 'コピー'}
    </Button>
  );
}
