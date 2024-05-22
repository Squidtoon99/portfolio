"use client";
import { ExtendedDocument } from "@/lib/extendedDocument";
import { useRouter } from "next/navigation";

export default function useAnimatedRouter() {
    const router = useRouter();
    const viewTransitionsStatus = () => {
        const extendedDocument = document as ExtendedDocument;
        let status = ";(, Your browser doesn't support the View Transitions API";
        if (extendedDocument?.startViewTransition) {
            status = ":), Your browser supports the View Transitions API";
        }
        return status;
    };
    // Navigate to the new route
    const animatedRoute = (url: string) => {
        const extendedDocument = document as ExtendedDocument;
        if (!extendedDocument.startViewTransition) {
            return router.push(url);
        } else {
            extendedDocument.startViewTransition(() => {
                router.push(url);
            });
        }
    };
    return { animatedRoute, viewTransitionsStatus };
}