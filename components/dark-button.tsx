"use client";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const DarkButton = () => {
    const [dark, setDark] = useState(true);

    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        setDark(!(localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)))
    }, [dark])

    const toggleDark = () => {
        setDark(isDark => {
            localStorage.theme = isDark ? "dark" : "light";
            return !isDark
        })
    }
    return <TooltipProvider delayDuration={150}>
        <Tooltip>
            <TooltipTrigger asChild>
                <button onClick={toggleDark} className="h-6 w-6 hover:cursor-pointer text-foreground/60 transition-all ease-in-out duration-300 hover:text-foreground/90">
                        {dark ? <MoonIcon className="text-violet-950/70 opacity-60 hover:opacity-100 h-6 w-6" /> : <SunIcon className="text-secondary-foreground opacity-60 hover:opacity-100 h-6 w-6" />}
                </button>
            </TooltipTrigger>
            <TooltipContent className="bg-foreground m-1">
                <p>Switch to {dark ? "dark" : "light"} mode</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
}