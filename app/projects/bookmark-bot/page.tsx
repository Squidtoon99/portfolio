import { Separator } from "@/components/ui/separator";
const headingClass = "nav-header mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0";

export const tags = [
    "Rust",
    "Cloudflare Workers",
    "Serverless",
    "WebAssembly",
    "Discord"
];

const HacScraper = () => {
    return <>
        <h2 className={headingClass} id="title">
            Bookmark Bot
        </h2>
        <Separator className="mb-6" />
        <p className="mt-4">
            Bookmark Bot is a Discord bot that allows users to save and organize their bookmarks in a Discord server. It is built with Rust, Cloudflare Workers, and WebAssembly.
        </p>


        <h2 className={headingClass} id="inspiration">Inspiration</h2>
        <p>
            Inspiration for this project came from the need to save and organize bookmarks in a more efficient way. We wanted to create a Discord bot that would allow users to save and organize their bookmarks in a Discord server, making it easier to access and share them with others. Daksh and I have been working on Discord bots for a while now, and we thought this would be a fun and useful project to work on together.
        </p>

        <h2 className={headingClass} id="implementation">Implementation</h2>
            Bookmark Bot is a Rust based Discord Bot that compiles down to WebAssembly and runs on the edge with Cloudflare Workers. This allows us to have cheap scalable hosting while also providing 100% uptime to our members without worrying about servcer management.
        <h2 className={headingClass} id="future-plans">Future Plans</h2>
        
    </>;
};

export default HacScraper;