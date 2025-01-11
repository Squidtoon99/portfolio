import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import image from "@/public/images/hac-scraper.png";

const headingClass = "nav-header mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0";

const RedditSearch = () => {
    return <>
        <h2 className={headingClass} id="title">
            Hac Scraper
        </h2>
        <Separator className="mb-6" />
        <Image src={image} alt="demo" className="dark:opacity-60 dark:hover:opacity-80 transition-all ease-in-out duration-150" />
        Inspiration
        Reddit is a very popular source of information and entertainment, but it is a common occurrence to be frustrated by its search function, which always struggles with finding results that are relevant to a search. For that reason, we decided to create a better search engine for Reddit.

        What it does
        SearchIt is simple and easy to use: you enter what you want to search, and it&rquos;ll return the most relevant and valuable results based on your search. You can use several filters, and search specifically for images.

        How we built it
        We used Google Cloud&rquos;s new Vertex API Suite to generate real-time Vector Embeddings for Reddit image and text posts. We then used Vector Search reading off Cloud Storage to run a similarity analysis to the user&rquos;s input search query and provide faster, more relevant, and useful results.

        Challenges we ran into
        We did not factor in the time it took for the AI models to train and scale on Google Cloud&rquos;s networks nor did we properly prototype a website and, as a result, ran into many time constraints while building.

        Accomplishments that we&rquos;re proud of
        We managed to pull off a working prototype interface with interactive elements, working links, and full database integration.

        What we learned
        We learned a lot about web technologies and how search engines operate. We have a lot more respect for search database developers now.

        What&rquos;s next for SearchIt
        We want to improve our algorithms to provide OCR analysis on images and potentially use the Reddit API stream to access more relevant data.
    </>;
};

export default RedditSearch;