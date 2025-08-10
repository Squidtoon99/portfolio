import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const headingClass = "nav-header mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0";

const BookmarkBot = () => {
  return (
    <>
      <h1 className={headingClass}>Bookmark Bot</h1>
      <Separator className="mb-6" />

      <section id="overview">
        <h2 className={headingClass}>Overview</h2>
        <p>
          Bookmark Bot is a Discord bot that lets users save, tag, and retrieve links
          directly inside their servers. The bot runs entirely on Cloudflare Workers,
          keeping infrastructure lightweight and fast.
        </p>
      </section>

      <section id="goals">
        <h2 className={headingClass}>Project Goals</h2>
        <p>
          The project aims to provide an always‑online bookmarking utility for Discord
          communities while showcasing how serverless technology can power full
          featured bots.
        </p>
      </section>

      <section id="challenges">
        <h2 className={headingClass}>Challenges</h2>
        <p>
          Working within the constraints of Workers and WebAssembly required careful
          handling of asynchronous Discord interactions and storage in a stateless
          environment.
        </p>
      </section>

      <section id="tech">
        <h2 className={headingClass}>Tech Stack</h2>
        <ul className="list-disc ml-6">
          <li>Rust</li>
          <li>Cloudflare Workers</li>
          <li>Discord API</li>
          <li>WebAssembly</li>
        </ul>
      </section>

      <section id="features">
        <h2 className={headingClass}>Features</h2>
        <ul className="list-disc ml-6">
          <li>Slash commands to save and categorize bookmarks</li>
          <li>Fast edge‑deployed responses with zero maintenance</li>
          <li>Shared bookmark lists for server members</li>
        </ul>
      </section>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Source Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link
              href="https://github.com/Squidtoon99/bookmark-bot"
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default BookmarkBot;
