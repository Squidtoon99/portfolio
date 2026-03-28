import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const headingClass = "nav-header mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0";

const HacScraper = () => {
  return (
    <>
      <h1 className={headingClass}>Hac Scraper</h1>
      <Separator className="mb-6" />

      <section id="overview">
        <h2 className={headingClass}>Overview</h2>
        <p>
          Hac Scraper pulls grades from a school&apos;s Home Access Center and displays
          them in a clean, responsive dashboard so students can check progress at a
          glance.
        </p>
      </section>

      <section id="goals">
        <h2 className={headingClass}>Project Goals</h2>
        <p>
          Provide a faster, more intuitive interface for monitoring grades and
          demonstrate how web scraping can improve access to otherwise clunky
          systems.
        </p>
      </section>

      <section id="challenges">
        <h2 className={headingClass}>Challenges</h2>
        <p>
          Reverse‑engineering the HAC network requests and parsing dynamic content
          proved tricky, especially when handling authentication and rate limits.
        </p>
      </section>

      <section id="tech">
        <h2 className={headingClass}>Tech Stack</h2>
        <ul className="list-disc ml-6">
          <li>Python</li>
          <li>BeautifulSoup &amp; Requests</li>
          <li>HTML/CSS</li>
        </ul>
      </section>

      <section id="features">
        <h2 className={headingClass}>Features</h2>
        <ul className="list-disc ml-6">
          <li>Scrapes grades on a set schedule</li>
          <li>Stores data locally for quick loading</li>
          <li>Simple web dashboard for each class</li>
        </ul>
      </section>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Source Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link
              href="https://github.com/Squidtoon99/HacScraper"
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

export default HacScraper;
