import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const headingClass = "nav-header mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0";

const SquidBotWorker = () => {
  return (
    <>
      <h1 className={headingClass}>Squid Bot Worker</h1>
      <Separator className="mb-6" />

      <section id="overview">
        <h2 className={headingClass}>Overview</h2>
        <p>
          Squid Bot Worker is a Cloudflare Worker written in Rust that serves as a
          lightweight API for the main Squid Bot project. Running on the edge keeps
          responses fast and infrastructure minimal.
        </p>
      </section>

      <section id="goals">
        <h2 className={headingClass}>Project Goals</h2>
        <p>
          Provide a stateless, globally distributed endpoint for bot commands and
          webhooks without managing full servers.
        </p>
      </section>

      <section id="challenges">
        <h2 className={headingClass}>Challenges</h2>
        <p>
          Adapting typical server logic to the worker environment required careful
          consideration of execution limits and storage.
        </p>
      </section>

      <section id="tech">
        <h2 className={headingClass}>Tech Stack</h2>
        <ul className="list-disc ml-6">
          <li>Rust</li>
          <li>Cloudflare Workers</li>
        </ul>
      </section>

      <section id="features">
        <h2 className={headingClass}>Features</h2>
        <ul className="list-disc ml-6">
          <li>Edge‑hosted API for Squid Bot</li>
          <li>Fast cold‑start times</li>
          <li>Zero server maintenance</li>
        </ul>
      </section>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Source Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link
              href="https://github.com/Squidtoon99/squid-bot-worker"
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

export default SquidBotWorker;
