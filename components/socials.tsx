import Link from "next/link";
import { DiscordLogoIcon,LinkedInLogoIcon, EnvelopeClosedIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { DarkButton } from "@/components/dark-button";
const iconClass = "w-6 h-6 text-foreground/60 transition-all ease-in-out duration-300 hover:text-foreground/90";

const sources = [
    {
        name: "Email",
        href: "mailto:arjunsnayak@gmail.com",
        icon: <EnvelopeClosedIcon className={iconClass} />
    },
    {
        name: "Github",
        href: "https://github.com/Squidtoon99",
        icon: <GitHubLogoIcon className={iconClass} />
    },
    {
        name: "Linkedin",
        href: "https://www.linkedin.com/in/arjun-nayak-23bb16253/",
        icon: <LinkedInLogoIcon className={iconClass} />
    },
    {
        name: "Discord",
        href: "https://discord.gg/5jmKhDGq3H",
        icon: <DiscordLogoIcon className={iconClass} />
    }

];

export const Socials = () => {
    return <div className="flex space-x-6 justify-start flex-row mt-8">
        {sources.map(({name, href, icon}) => {
            return <Link href={href} key={name} className={iconClass}>
                {icon}
            </Link>
        })}
        <DarkButton />
    </div>
}