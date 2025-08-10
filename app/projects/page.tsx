import Link from "next/link";

interface Project {
  name: string;
  path: string;
  description: string;
}

const getProjects = async (): Promise<Project[]> => {
  const response = await fetch("https://api.github.com/users/Squidtoon99/repos?per_page=100");
  const data = await response.json();
  return data
    .filter((project: any) => project.stargazers_count > 1)
    .map((project: any) => {
      const slug = project.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      const name = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return {
        name,
        path: `/projects/${slug}`,
        description: project.description,
      };
    });
};

const Projects = async () => {
  const projects = await getProjects();

  return (
    <div>
      <h1 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Projects
      </h1>
      <div className="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-1 group/list">
        {projects.map((project) => (
          <Link passHref href={project.path} key={project.path}>
            <div className="p-4 rounded-md w-full bg-primary/5 dark:bg-background lg:hover:bg-primary/5 lg:hover:!opacity-100 lg:group-hover/list:opacity-50 duration-200 ease-in-out">
              <h2 className="text-xl font-semibold tracking-tight">{project.name}</h2>
              <p className="mt-2 text-foreground dark:text-foreground/50">
                {project.description || "Click to learn more"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Projects;
