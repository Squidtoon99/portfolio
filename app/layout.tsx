import { CursorGradient } from '@/components/cursor-gradient';
import { Nav } from '@/components/nav';
import { Socials } from '@/components/socials';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Arjun Nayak",
  description: "Bringing realtime analytics to the web.",
  applicationName: "Arjun Nayak Portfolio",
  authors: [{ name: "Arjun Nayak", url: "https://squid.pink" }],
  keywords: ["Arjun", "Nayak", "Arjun Nayak", "Portfolio", "Software", "Developer", "Web", "Analytics", "Realtime", "Data", "Visualization", "React", "Next.js", "Typescript", "Javascript", "Python", "Rust", "Golang", "Kubernetes", "Grafana", "InfluxDB", "PostgreSQL", "Redis", "Discord", "Stripe", "Material UI", "Tailwind CSS", "Vercel", "Google Cloud", "Digital Ocean", "AWS", "Azure", "Hackathon", "HackTX", "HackTAMS"],
  icons: [
    { rel: "icon", url: "/favicon.jpg" },
  ],
  openGraph: {
    title: "Arjun Nayak's Portfolio",
    description: "Bringing realtime analytics to the web.",
    images: "/preview.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen font-sans bg-primary/5 dark:bg-background leading-relaxed text-foreground antialiased selection:bg-secondary selection:text-secondary-foreground transition-all duration-300 ease-in-out", inter.variable)}>
        <CursorGradient />
        {/* <div className="pointer-events-none fixed inset-0 z-30 transition duration-300" style={{ background: "radial-gradient(600px at 557px 134px, rgba(150, 0, 255, 0.15), transparent 90%)" }}></div>  */}
        <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
          <div className="lg:flex lg:justify-between lg:gap-4">
            {/* <div className="fixed lg:inset-0 lg:right-[55%] bg-zinc-900 dark:bg-foreground/5" /> */}
            <div className="fixed-profile">
              <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-full lg:pr-4 lg:pl-8 lg:flex-col lg:justify-between lg:py-24 lg:text-foreground dark:lg:text-foreground">
                <div>
                  <h1 className="text-4xl inline-flex sm:text-6xl font-bold group-hover:tracking-wide transition-all ease-in-out duration-300">
                    Arjun Nayak
                  </h1>
                  <h2 className="mt-3 text-lg font-medium tracking-tight text-foreground sm:text-xl">Ex Data Analytics Intern @ DELL</h2>
                  <blockquote className="space-y-4 mt-3 max-w-sm">
                    <p className="text-lg opacity-60 group-hover:tracking-tighter transition-all ease-in-out duration-300">
                      I build powerful distributed data systems and realtime analytics dashboards for high performance applications.
                    </p>
                  </blockquote>
                  <div className="p-2 hidden lg:flex">
                    <Nav />
                  </div>
                  <Socials />
                </div>
              </header>
            </div>
            <main id="content" className="transition-out pt-24 flex flex-col align-middle lg:w-1/2 lg:pl-4 lg:py-24">
              {children}
            </main>
          </div>
        </div>
      </body>
      <Analytics />
      <GoogleAnalytics gaId="G-90WSW84B7N" />
    </html>
  )
}
