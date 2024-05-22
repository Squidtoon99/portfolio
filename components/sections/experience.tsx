import { Tag } from "../Tag";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";


const data = [
    {
        company: "Dallas Formula Racing",
        positions: ["Software Lead", "Software Team Member"],
        date: "2023 — PRESENT",
        description: "Developing a realtime analytics dashboard to allow on-site engineers to visualize live metrics data and make more impactful decisions to improve the car.",
        links: [
            {
                name: "title",
                url: "https://dallasformularacing.com"
            },
            {
                name: "Github",
                url: "https://github.com/DallasFormulaRacing/"
            }
        ],
        tags: ["Grafana", "PostgreSQL", "Telegraf", "Python"]
    },
    {
        company: "Friskytool",
        positions: ["Founder"],
        date: "2018 — 2022",
        description: "Built a chatbot that faciliated giveaways for more than 30,000 discord servers. With a peak weekly user count of more than 80,000: Friskytool creates reliable giveaways for some of the largest servers on discord",
        links: [
            {
                name: "title",
                url: "https://frisky.dev"
            },
            {
                name: "Analytics Dashboard",
                url: "/projects/analytics"
            }
        ],
        tags: ["Kubernetes", "Microservices", "Python", "Discord", "Rust", "Knative"]
    },
    {
        company: "Giving By Gaming",
        positions: ["Lead Developer", "Developer"],
        date: "2019 — 2021",
        description: "Developed a stripe payment dashboard with integration into a nonprofit's discord to automate payment processing at scale.",
        links: [
            {
                name: "title",
                url: "https://givingbygaming.com"
            },
            {
                name: "Website",
                url: "https://givingbygaming.org"
            },
            {
                name: "Github",
                url: "https://github.com/squidtoon99/givingbygaming"
            }
        ],
        tags: ["Next.js", "Typescript", "Stripe", "Material UI"]
    }
];

export const Experience = () => {
    return <div className="nav-header flex flex-col mb-12" id="experience">
        <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-100">
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground lg:sr-only">
                Experience
            </h2>
        </div>
        <ol className="group/list">
            {data.map(({ company, positions, date, description, links, tags }) => {
                return <li key={company} className="mb-4">
                    <Card className="group relative py-4 px-1 border-none shadow-none lg:bg-transparent drop-shadow-none grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:bg-primary/5 lg:hover:!opacity-100 lg:group-hover/list:opacity-50 duration-200 ease-in-out">
                        <div className="absolute -inset-x-4 -inset-y-4 z-0 rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block" />
                        <CardHeader className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-foreground sm:col-span-2" aria-label="2018 to Present">{date}</CardHeader>
                        <CardContent className="z-10 sm:col-span-6">
                            <CardTitle className="font-medium leading-snug text-foreground">
                                <div>
                                    <Link className="inline-flex items-baseline font-medium leading-tight text-foreground hover:text-primary focus-visible:text-primary  group/link text-base" href={links[0]['url']} target="_blank" rel="noreferrer" aria-label="Lead Engineer at Upstatement">
                                        <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block">
                                        </span>
                                        <span>{positions[0]} ·{" "}<span className="inline-block">{company}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" aria-hidden="true">
                                            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd">
                                            </path>
                                        </svg>
                                        </span>
                                        </span>
                                    </Link>
                                </div>
                                <div>
                                    {positions.slice(1).map(title => (<div className="text-foreground/60" key={title} aria-hidden="true">{title}</div>))}
                                </div>
                                
                            </CardTitle>
                            <CardDescription className="mt-2">
                                {description}
                            </CardDescription>
                            <ul className="mt-2 flex flex-wrap">
                                {links.filter(i => i.name != "title").map(({ name, url }) => {
                                    return <Link key={name} href={url} className="relative mt-2 mr-2 inline-flex items-center text-sm font-medium text-foreground hover:text-primary focus-visible:text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-1 h-3 w-3" aria-hidden="true"><path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"></path><path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z"></path></svg>
                                        {name}
                                    </Link>
                                })}
                            </ul>
                            <CardFooter className="hidden lg:flex lg:flex-wrap p-0 mt-2">
                                {tags.map(tag => (<Tag name={tag}  key={tag} className="z-40 mouse-pointer mr-1.5 leading-snug mt-2 text-xs font-medium dark:bg-primary/25 dark:text-primary bg-primary text-primary/25 rounded-full text-center px-2 py-1"/>))}
                            </CardFooter>
                        </CardContent>
                    </Card>
                </li>;
            })}
        </ol>
        <Link href="/resume.pdf" className="inline-flex group hover:text-primary transition-all duration-300 ease-in-out">
            View Full Resume <span className="ml-2 group-hover:-rotate-12 transition-all duration-300 ease-in-out">→</span>
        </Link>
        
    </div>;
};