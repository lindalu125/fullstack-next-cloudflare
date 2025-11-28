import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-0 active:scale-98",
    {
        variants: {
            variant: {
                // Primary: White/Black background with border (Apple-style)
                default:
                    "bg-light-bg-primary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary border border-light-border dark:border-dark-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary shadow-sm",
                // Secondary: Black/White background (inverted)
                secondary:
                    "bg-light-text-primary dark:bg-dark-text-primary text-light-bg-primary dark:text-dark-bg-primary hover:opacity-90 shadow-sm",
                // Ghost: Transparent with border
                ghost: "bg-transparent text-light-text-primary dark:text-dark-text-primary border border-light-text-primary dark:border-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary",
                // Outline: Same as ghost
                outline:
                    "bg-transparent text-light-text-primary dark:text-dark-text-primary border border-light-border dark:border-dark-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary shadow-sm",
                // Destructive: Error state (semantic color)
                destructive:
                    "bg-error text-white shadow-sm hover:bg-error/90 focus-visible:ring-error/20",
                // Link: Text only
                link: "text-light-text-primary dark:text-dark-text-primary hover:text-light-text-secondary dark:hover:text-dark-text-secondary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-3 has-[>svg]:px-4",
                sm: "h-8 rounded-md gap-1.5 px-4 has-[>svg]:px-3",
                lg: "h-12 rounded-lg px-8 has-[>svg]:px-6",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    }) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
