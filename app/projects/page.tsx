import { Button } from "@/components/ui/button";
import fs from "fs";
import Link from "next/link";

const getAllPages = async () => {
    const files = fs.readdirSync("./app/projects/");
    return files.filter(f => f !== "page.tsx").map((file) => {
        return {
            name: file.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
            path: file
        };
    });
};

// All projects with at least 1 star
const getGithubProjects = async () => {
    const response = await fetch("https://api.github.com/users/squidtoon99/repos");
    const data = await response.json();
    // sort by stars
    return data.filter((project: any) => project.stargazers_count > 0).sort((p: any) => p.updated_at).map((project: any) => {
        return {
            name: project.name + " (GitHub)",
            description: project.description,
            tags: project.topics,
            date: project.updated_at,
            path: "https://github.com/Squidtoon99/" + project.name.toLowerCase().replace(" ", "-")
        };
    }
    );
}



/*
projects = [{"name":"Analytics","path":"analytics"},{"name":"Bookmark Bot","path":"bookmark-bot"},{"name":"Dfr","path":"dfr"},{"name":"Hac Scraper","path":"hac-scraper"},{"name":"Reddit Search","path":"reddit-search"}]
*/
type Project = {
    name: string;
    path: string;
    date: string;
    description: string;
    tags: string[];
}

const Projects = async () => {
    // find all pages in /projects

    let projects: Project[] = [];

    // get all projects with at least 1 star
    const githubProjects = await getGithubProjects();
    projects = githubProjects;

    const extraProjects = await getAllPages();
    for (const project of extraProjects) {
        if (!projects.find(p => p.name === project.name)) {
            projects.push({
                name: project.name,
                description: "Click to learn more",
                tags: [],
                path: "/projects/" + project.path,
                date: ""
            });
        }
    }

    return (
        <div>
            <h1 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Projects</h1>
            <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-1 group/list">
                {projects.map((project) => {
                    return (
                        <Link passHref href={project.path} key={project.path}>
                            <div className="p-4 rounded-md w-full bg-primary/5 dark:bg-background lg:hover:bg-primary/5 lg:hover:!opacity-100 lg:group-hover/list:opacity-50 duration-200 ease-in-out">
                                <h2 className="text-xl font-semibold tracking-tight">{project.name}</h2>
                                <p className="mt-2 text-foreground dark:text-foreground/50">{project.description || "Click to learn more"}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Projects;