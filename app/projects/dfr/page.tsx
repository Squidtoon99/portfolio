import { Separator } from "@/components/ui/separator";
import Image from "next/image";

const headingClass = "nav-header mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0";

const DFR = () => {
    return <>
        <h2 className={headingClass} id="title">
            Real-time Analytics Dashboard
        </h2>
        <Separator className="mb-6" />
        {/* <Image src={image} alt="demo" className="dark:opacity-60 dark:hover:opacity-80 transition-all ease-in-out duration-150" /> */}
        <p className="mt-4">
            This dashboard utilizes a lot of...
        </p>


        <h2 className={headingClass} id="inspiration">Inspiration</h2>
        <p>
            The inspiration for our project was the students we saw at our school constantly refreshing their Home Access Center to get their grades. Not only was it slow, but it wasted a lot of time! We decided to create a better UI for the system, therefore making it easier to get your grades faster.

        </p>

        <h2 className={headingClass} id="implementation">Implementation</h2>
        Connects to the Home Access Center, uses it&rsquo;s network requests to update your grades every minute, and moves them to a local database in order to display them quickly.

        We reverse engineered the network requests that the Home Access Center makes to it&rsquo;s server and scrape it every minute. We can&rsquo;t run it ourselves because of liability issues stemming from storing people&rsquo;s grades, so it&rsquo;s a localhost-based program. We had difficulty making the scraper render JavaScript content and get the grade information we need, leading to a 4 hour long debug session that ended with us submitting our project just on the nick of time.

        Not only is the UI better looking than we thought it would be, the web scraper is also really efficient and works extremely well.

        We learnt a lot about hackathons in general and how to work efficiently, also we learned a ton about web scraping!
        <h2 className={headingClass} id="future-plans">Future Plans</h2>
        One of our original aspirations for this project was to implement notifications, so in the future we&rsquo;re probably going to add that (which should be pretty simple in theory). Other than that, I&rsquo;d say this project is pretty much complete!
        Built With
    </>;
};

export default DFR;