"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AnimatedLink from "./AnimatedLink";
import useAnimatedRouter from "@/lib/hooks/use-animated-router";

export const Nav = () => {
    const [sections, setSections] = useState(["about", "experience", "projects"]);
    const [currentSection, setCurrentSection] = useState("about");

    const path = usePathname();

    useEffect(() => {

        let sectionObjects = Array.from(document.getElementsByClassName("nav-header"));

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    setCurrentSection(entry.target.id);
                }
            });
        }, { threshold: 0.5 });
        
        const newSections = [];
        for (var object of sectionObjects) {
            if (object) {
                observer.observe(object);
                newSections.push(object.id);
            } else {
                console.log("object is null");
            }
        }
        console.log("new sections");
        if (sections !== newSections) {
            setSections(newSections);
        }
        return () => {
            observer.disconnect();
        };
    }, [path]);
    
    return <nav className="nav hidden lg:block" aria-label="In-page jump links">
        <ul className="mt-8 w-max">
            {sections.map(section => <li key={section}>
                <a className="group flex items-center py-3" href={`#${section}`}>
                    <span style={{
                        width: "4 rem"
                    }} className={cn("nav-indicator mr-4 h-px w-8 bg-foreground transition-all group-hover:w-16 [&.active]:w-16 group-hover:bg-foreground [&.active]:bg-foreground group-focus-visible:w-16 group-focus-visible:bg-foreground motion-reduce:transition-none", section === currentSection ? "active" : "")}>
                    </span>
                    <span className={cn("nav-text text-xs font-bold uppercase tracking-widest text-foreground/40 [&.active]:text-foreground/90 group-hover:text-foreground group-focus-visible:text-foreground", section === currentSection ? "active" : "")}>
                        {section.split("-").map(string => string.charAt(0).toUpperCase() + string.slice(1)).join(" ")}
                    </span>
                </a>
            </li>)}
            {path !== "/" &&
                <AnimatedLink className="group flex items-center py-3" href="/">
                    <span style={{
                        width: "4 rem"
                    }} className={"nav-indicator mr-4 h-px w-8 bg-foreground transition-all group-hover:w-16 [&.active]:w-16 group-hover:bg-foreground [&.active]:bg-foreground group-focus-visible:w-16 group-focus-visible:bg-foreground motion-reduce:transition-none"} />
                    <span className="nav-text text-xs font-bold uppercase tracking-widest text-foreground/40 [&.active]:text-foreground/90 group-hover:text-foreground group-focus-visible:text-foreground">
                        Back Home
                    </span>
                </AnimatedLink>
            }
        </ul>
    </nav>;
};