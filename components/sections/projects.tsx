import { ChevronDownIcon, LightningBoltIcon, ShadowInnerIcon, StarIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import AnimatedLink from "@/components/AnimatedLink";
const project_data = [
    {
        src: "/HackTX-2024-RAAA/PrimeTime",
        links: [
            {
                name: "Devpost",
                url: "https://devpost.com/software/primetime-285zcm"
            },
            {
                name: "Linkedin Post",
                url: "https://www.linkedin.com/posts/arjun-s-nayak_hacktx-hacktx-activity-7259788000547479552-IvdN?utm_source=share&utm_medium=member_desktop"
            }
        ],
        awards: [
            {
                name: "2nd Intel Track",
                location: "HackTX 2024",
                url: "https://devpost.com/software/primetime-285zcm"
            }
        ],
        description: "A web platform designed to optimize time management and boost productivity utilizing local LLMs.",
    },
    {
        src: "/squidtoon99/bookmark-bot",
        links: [
            {
                name: "Inspiration",
                url: "/projects/bookmark-bot"
            },
            {
                name: "Website",
                url: "https://bookmarker.squid.pink/"
            }
        ],
        awards: []
    },
    {
        src: "/squidtoon99/redditsearch",
        links: [
            {
                name: "Inspiration",
                url: "/projects/reddit-search"
            }
        ],
        awards: [
            {
                name: "Best use of Google Cloud",
                location: "HackTX 2023",
                url: "https://devpost.com/software/searchit-38n6ps"
            },
            {
                name: "Novice Hack",
                location: "HackTX 2023",
                url: "https://devpost.com/software/searchit-38n6ps"
            }
        ]
    },
    {
        src: "/squidtoon99/hacscraper",
        links: [
            {
                name: "Inspiration",
                url: "/projects/hac-scraper"
            }
        ],
        awards: [
            {
                name: "Best UI/UX",
                location: "HackTAMS",
                url: "https://devpost.com/software/hacscraper"
            }
        ],
        description: "Web scraper with automatic grade notifications, class schedules, and powerful analaysis tools."
    }
];

async function getData() {
    const results: Project[] = [];

    for (let project of project_data) {
        const res = await fetch(`https://api.github.com/repos${project.src}`);
        const data = await res.json();
        results.push({ ...data, ...project });
    }

    return results;
}

type Project = {
    name: string;
    src: string;
    links: {
        name: string;
        url: string;
    }[];
    awards: {
        name: string;
        location: string;
        url: string;
    }[];
    description: string;
    language: string;
    stargazers_count: number;
    updated_at: string;
};

export const Projects = async () => {
    const projects: Project[] = await getData();

    return <div id="projects" className="nav-header flex flex-col">
        <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/50 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-100">
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground lg:sr-only">
                Projects
            </h2>
        </div>
        <ol className="flex flex-col space-y-4 group/list">
            {projects.map(({ name, src, links, awards, description, language, stargazers_count, updated_at }) => <li key={name}>
                <Card key={name} className="border-transparent hover:border-background/50 lg:bg-transparent lg:hover:bg-primary/5 lg:hover:!opacity-100 lg:group-hover/list:opacity-70 duration-200 ease-in-out transition-all">
                    <CardHeader className="grid lg:grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                        <div className="space-y-1">
                            <CardTitle>{name}</CardTitle>
                            <CardDescription className="w-full">
                                <div className="flex flex-col">
                                    <div className="w-full">{description}</div>
                                    <div className="flex flex-col space-y-0 mt-1">
                                        {awards.length > 0 && awards.map(({ name, url, location }: { name: string; url: string; location: string; }) => <Link key={name} href={url}>
                                            <div key={name} className="flex flex-row text-sm text-muted-foreground">
                                                <LightningBoltIcon className="h-3 w-3 mr-1 mt-1 text-primary" />
                                                <div className="text-transparent bg-clip-text bg-gradient-to-tl from-primary to-primary">{name}</div>
                                                <div className="hidden lg:flex ml-1 text-">•{" "}{location}</div>
                                            </div>
                                        </Link>
                                        )}
                                    </div>
                                </div>
                            </CardDescription>
                        </div>
                        <div className="hidden lg:flex items-center space-x-1 rounded-md bg-secondary/30 text-secondary-foreground">
                            <a href={`https://github.com${src}`} target="_blank">
                                <Button variant="secondary" className="px-3 shadow-none bg-secondary/10 group">
                                    {/* on hover switch between StarIcon and StarFilledicon */}
                                        
                                    <span className="mr-2 h-4 w-4">
                                        <StarIcon className="h-full w-full group-hover:hidden" />
                                        <StarFilledIcon className="h-full w-full hidden group-hover:block" />
                                    </span>

                                    Star
                                </Button>
                            </a>
                            <Separator orientation="vertical" className="h-[20px]" />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" className="px-2 shadow-none bg-secondary/30">
                                        <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    alignOffset={-5}
                                    className="w-[200px] rounded-md shadow-none bg-secondary/1 backdrop-blur-sm"
                                    forceMount
                                >
                                    <DropdownMenuLabel>Learn More</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-primary/10" />
                                    {links.filter(({ name }) => name !== "Github").map(({ name, url }) => {
                                        return <AnimatedLink key={name} href={url}>
                                            <DropdownMenuItem className="focus:bg-primary/5">{name}</DropdownMenuItem>
                                        </AnimatedLink>;
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex space-x-4 text-sm text-muted-foreground">

                            <div className="flex items-center">
                                <ShadowInnerIcon className="mr-1 h-3 w-3 fill-primary text-primary/70" />
                                {language}
                            </div>
                            <div className="flex items-center">
                                <StarIcon className="mr-1 h-3 w-3" />
                                {stargazers_count > 1000 ? `${(stargazers_count / 1000).toFixed(1)}k` : stargazers_count}
                            </div>
                            <div>
                                Updated{" "}
                                {new Date(updated_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </li>)}
        </ol>
        <AnimatedLink href="/projects" className="inline-flex group hover:text-primary transition-all duration-300 ease-in-out mt-6">
            View Project Archive <span className="ml-2 group-hover:-rotate-12 transition-all duration-300 ease-in-out">→</span>
        </AnimatedLink>
    </div>;
};