"use client";
import useAnimatedRouter from "@/lib/hooks/use-animated-router";
import Link from "next/link";
import React from "react";

type Props = {
    href: string;
    children: React.ReactNode;
    className?: string;
};
export default function AnimatedLink({ href, children, className }: Props) {
    const { animatedRoute } = useAnimatedRouter();
    return (
        <Link
            href={href}
            onClick={() => {
                animatedRoute(href);
            }}
            className={className}
            passHref
        >
            {children}
        </Link>
    );
}