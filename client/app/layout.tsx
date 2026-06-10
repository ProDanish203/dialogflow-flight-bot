import type { Metadata } from 'next';
import { Poppins, Roboto } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from 'sonner';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/shared/app-sidebar';
import { TopNav } from '@/components/shared/top-nav';

const poppins = Poppins({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Dialog Flow ES Chatbot',
  description: 'Dialog Flow ES Chatbot',
  keywords: [
    'dialog flow',
    'es chatbot',
    'chatbot',
    'dialog flow es',
    'dialog flow es chatbot',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          'h-svh overflow-hidden antialiased overflow-x-clip',
          poppins.className,
          roboto.variable,
        )}
      >
        <Toaster richColors position="top-right" />
        <TooltipProvider>
          <SidebarProvider className="h-svh min-h-0 overflow-hidden">
            <AppSidebar />
            <SidebarInset className="min-h-0 overflow-hidden">
              <TopNav />
              <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
