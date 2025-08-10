import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const headingClass = "nav-header mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0";

const Squidbot = () => {
  return (
    <>
      <h1 className={headingClass}>Squidbot</h1>
      <Separator className="mb-6" />

      <section id="overview">
        <h2 className={headingClass}>Overview</h2>
        <p>
          Squidbot is a modular Discord bot featuring a collection of commands and
          utilities designed to be easily extended and self‑hosted.
        </p>
      </section>

      <section id="goals">
        <h2 className={headingClass}>Project Goals</h2>
        <p>
          The project serves as a playground for building reusable Discord bot
          modules and experimenting with containerized deployments.
        </p>
      </section>

      <section id="challenges">
        <h2 className={headingClass}>Challenges</h2>
        <p>
          Maintaining a clean architecture while supporting asynchronous Discord
          events and multiple optional features required careful design.
        </p>
      </section>

      <section id="tech">
        <h2 className={headingClass}>Tech Stack</h2>
        <ul className="list-disc ml-6">
          <li>Python</li>
          <li>Discord.py</li>
          <li>Docker</li>
        </ul>
      </section>

      <section id="features">
        <h2 className={headingClass}>Features</h2>
        <ul className="list-disc ml-6">
          <li>Modular command system</li>
          <li>Containerized for easy deployment</li>
          <li>Utilities like moderation and leveling</li>
        </ul>
      </section>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Source Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link
              href="https://github.com/Squidtoon99/Squidbot"
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

export default Squidbot;
