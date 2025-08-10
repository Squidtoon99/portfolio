import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const headingClass = "nav-header mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0";

const Project0 = () => {
  return (
    <>
      <h1 className={headingClass}>Project0</h1>
      <Separator className="mb-6" />

      <section id="overview">
        <h2 className={headingClass}>Overview</h2>
        <p>
          Project0 is a simple static website built during my earliest days of web
          development. It represents initial experiments with HTML and CSS.
        </p>
      </section>

      <section id="goals">
        <h2 className={headingClass}>Project Goals</h2>
        <p>
          The project existed primarily as a learning exercise to understand the
          structure of web pages and how styling works.
        </p>
      </section>

      <section id="challenges">
        <h2 className={headingClass}>Challenges</h2>
        <p>
          As my first foray into front‑end code, grasping the relationship between
          markup and layout proved to be the main hurdle.
        </p>
      </section>

      <section id="tech">
        <h2 className={headingClass}>Tech Stack</h2>
        <ul className="list-disc ml-6">
          <li>HTML</li>
          <li>CSS</li>
        </ul>
      </section>

      <section id="features">
        <h2 className={headingClass}>Features</h2>
        <ul className="list-disc ml-6">
          <li>Static multi‑page layout</li>
          <li>Basic styling and navigation</li>
        </ul>
      </section>

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Source Code</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link
              href="https://github.com/Squidtoon99/project0"
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

export default Project0;
