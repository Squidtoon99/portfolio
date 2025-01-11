import { CalendarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { HTMLAttributes, PropsWithRef } from "react";

type Stack = {
    description: string;
    image: string;
    date: string | null;
    link: URL | string;
};

const stack_data: { [key: string]: Stack} = {
    "Next.js": {
        description: "The React Framework – created and maintained by @vercel.",
        image: "https://assets.vercel.com/image/upload/v1538361091/repositories/next-js/next-js.png",
        date: "2016",
        link: "https://nextjs.org"
    },
    "React": {
        description: "A JavaScript library for building user interfaces.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
        date: "2013",
        link: "https://reactjs.org"
    },
    "Typescript": {
        description: "TypeScript extends JavaScript by adding types.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png",
        date: "2012",
        link: "https://www.typescriptlang.org"
    },
    "Javascript": {
        description: "JavaScript is the programming language of the Web.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/480px-JavaScript-logo.png",
        date: "1995",
        link: "https://www.javascript.com"
    },
    "Python": {
        description: "Python is a programming language that lets you work quickly and integrate systems more effectively.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/768px-Python-logo-notext.svg.png",
        date: "1991",
        link: "https://www.python.org"
    },
    "Rust": {
        description: "A language empowering everyone to build reliable and efficient software.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Rust_programming_language_black_logo.svg/1200px-Rust_programming_language_black_logo.svg.png",
        date: "2010",
        link: "https://www.rust-lang.org"
    },
    "Kubernetes": {
        description: "Kubernetes is an open-source system for automating deployment, scaling, and management of containerized applications.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Kubernetes_logo_without_workmark.svg/1200px-Kubernetes_logo_without_workmark.svg.png",
        date: "2014",
        link: "https://kubernetes.io"
    },
    "Grafana": {
        description: "The open observability platform.",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Grafana_logo.svg",
        date: "2014",
        link: "https://grafana.com"
    },
    "InfluxDB": {
        description: "InfluxDB is an open-source time series database developed by InfluxData.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Influxdb_logo.svg/1200px-Influxdb_logo.svg.png",
        date: "2013",
        link: "https://www.influxdata.com"
    },
    "Telegraf": {
        description: "The plugin-driven server agent for collecting & reporting metrics.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Influxdb_logo.svg/1200px-Influxdb_logo.svg.png",
        date: "2015",
        link: "https://www.influxdata.com/time-series-platform/telegraf/"
    },
    "PostgreSQL": {
        description: "PostgreSQL is a powerful, open source object-relational database system.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1200px-Postgresql_elephant.svg.png",
        date: "1996",
        link: "https://www.postgresql.org"
    },
    "Redis": {
        description: "Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache, and message broker.",
        image: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Redis_Logo.svg/1200px-Redis_Logo.svg.png",
        date: "2009",
        link: "https://redis.io"
    },
    "Discord": {
        description: "Discord is a voice, video and text communication service to talk and hang out with your friends and communities.",
        image: "https://pbs.twimg.com/profile_images/1709258593076473857/6zR-uskH_400x400.jpg",
        date: "2015",
        link: "https://discord.com"
    },
    "Stripe": {
        description: "Stripe is a technology company that builds economic infrastructure for the internet.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1200px-Stripe_Logo%2C_revised_2016.svg.png",
        date: "2010",
        link: "https://stripe.com"
    },
    "Material UI": {
        description: "React components for faster and easier web development. Build your own design system, or start with Material Design.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Check_Material_UI_Logo.svg/1200px-Check_Material_UI_Logo.svg.png",
        date: "2014",
        link: "https://material-ui.com"
    },
    "Tailwind CSS": {
        description: "The utility-first CSS framework. Rapidly build modern websites, without ever leaving your HTML.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Tailwind_CSS_Logo.svg/1200px-Tailwind_CSS_Logo.svg.png",
        date: "2017",
        link: "https://tailwindcss.com"
    },
    "Vercel": {
        description: "Develop. Preview. Ship. For the best frontend teams – Vercel.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Vercel-Logo.svg/1200px-Vercel-Logo.svg.png",
        date: "2015",
        link: "https://vercel.com"
    },
    "Google Cloud": {
        description: "Google Cloud Platform, offered by Google, is a suite of cloud computing services that runs on the same infrastructure that Google uses internally for its end-user products.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/GCP_Logo.svg/1200px-GCP_Logo.svg.png",
        date: "2008",
        link: "https://cloud.google.com"
    },
    "Knative": {
        description: "Knative provides a set of middleware components that are essential to build modern, source-centric, and container-based applications that can run anywhere: on premises, in the cloud, or even in a third-party data center.",
        image: "https://pbs.twimg.com/profile_images/1022537350562250752/m5EQknfW_400x400.jpg",
        date: "2018",
        link: "https://knative.dev"
    },
    "Datadog": {
        description: "Datadog is the monitoring and security platform for cloud applications.",
        image: "https://pbs.twimg.com/profile_images/1501312871610912778/S5nsjosS_400x400.png",
        date: "2010",
        link: "https://www.datadoghq.com"
    },
    "Microservices": {
        description: "Microservices are a software development technique—a variant of the service-oriented architecture (SOA) architectural style that structures an application as a collection of loosely coupled services.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microservice_architecture.svg/1200px-Microservice_architecture.svg.png",
        date: null,
        link: "https://en.wikipedia.org/wiki/Microservices"
    },
    "Power BI": {
        description: "Power BI is a business analytics solution that lets you visualize your data and share insights across your organization, or embed them in an app or website.",
        image: "https://upload.wikimedia.org/wikipedia/en/2/20/Power_BI_logo.svg",
        date: "2013",
        link: "https://powerbi.microsoft.com"
    },
    "Jupyter Notebooks": {
        description: "The Jupyter Notebook is an open-source web application that allows you to create and share documents that contain live code, equations, visualizations and narrative text.",
        image: "https://upload.wikimedia.org/wikipedia/commons/3/38/Jupyter_logo.svg",
        date: "2014",
        link: "https://jupyter.org"
    },
    "Pandas": {
        description: "pandas is a fast, powerful, flexible and easy to use open source data analysis and data manipulation library built on top of the Python programming language.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Pandas_logo.svg/1200px-Pandas_logo.svg.png",
        date: "2008",
        link: "https://pandas.pydata.org"
    },
    "ETL": {
        description: "Extract, transform, load (ETL) is the general procedure of copying data from one or more sources into a destination system which represents the data differently from the source(s).",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/ETL_logo.svg/1200px-ETL_logo.svg.png",
        date: null,
        link: "https://en.wikipedia.org/wiki/Extract,_transform,_load"
    }
}

export function Tag({ name, ...props }: { name: string; className?: string; }){
    if (!(name in stack_data))
        return <div {...props}>n: {name}</div>;
    const { description, image, date, link } = stack_data[name];
    
    return (
        <HoverCard openDelay={50} closeDelay={50}>
            <HoverCardTrigger {...props}>
                {name}
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                    <Avatar>
                        <AvatarImage src={image} />
                        <AvatarFallback>{name.split(" ").map((word) => word[0]).join("").toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <Link href={link}>
                            <h4 className="text-sm font-semibold">@{name}</h4>
                        </Link>
                        <p className="text-sm">
                            {description}
                        </p>
                        {date && <div className="flex items-center pt-2">
                            <CalendarIcon className="mr-2 h-4 w-4" />{" "}
                            <span className="text-xs text-muted-foreground">
                                Created {date}
                            </span>
                        </div>}
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
