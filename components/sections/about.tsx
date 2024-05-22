import {default as NextLink} from "next/link";
import AnimatedLink from "../AnimatedLink";

const Link = ({ children, href }: { children: any, href: string; }) => {
    return <NextLink href={href} className="font-bold hover:text-primary/75">
        {children}
    </NextLink>;
}

export const About = () => {
    return (
        <section id="about" className="nav-header mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/50 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-100">
                <h2 className="text-sm font-bold uppercase tracking-widest text-foreground lg:sr-only">
                    About
                </h2>
            </div>
            <div className="px-4 py-2 text-foreground/90">
                <p className="mb-4">
                    I started software development in high school where I quickly found a passion for coding where I built chatbots and devops systems discovering a world of developers.
                    Fast forward to today, I&rsquo;m pursuing a computer science major at <strong>The University of Texas at Dallas.</strong> I&rsquo;ve had the opportunity to build a <AnimatedLink href="/projects/friskytool">chat bot</AnimatedLink>, an <AnimatedLink href="/projects/analytics">analytics dashboard</AnimatedLink>, and create a scalable <Link href="/projects/remote-ide">Remote IDE</Link> system.
                </p>
                <p className="mb-4">
                    Nowadays, I have started development on a realtime analytics dashboard for my school&rsquo;s <Link href="https://dallasformularacing.com">Formula Club</Link>. In my free time I&rsquo;ve built a serverless <Link href="https://bookmarker.squid.pink/">bookmark bot</Link> that pairs the speed of Cloudflare Workers with the security of Rust.   
                </p>
                <p className="mb-4">
                    Outside of computer science, I play ultimate frisbee, skateboard campus hills, and recover from injuries inflicted by the previous two.
                </p>
            </div>
        </section>
    );
};