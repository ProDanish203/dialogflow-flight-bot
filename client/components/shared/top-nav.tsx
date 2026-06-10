'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';

export function TopNav() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger />
      <div className="h-14 w-px shrink-0 bg-border" aria-hidden="true" />
      <span className="text-sm font-medium">Chat</span>
    </header>
  );
}
