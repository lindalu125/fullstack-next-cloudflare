import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Breadcrumb Component
 * Navigation breadcrumb trail
 */
export function Breadcrumb({
    items,
}: {
    items: Array<{
        label: string;
        href?: string;
    }>;
}) {
    return (
        <nav aria-label="Breadcrumb" className="py-4">
            <ol className="flex items-center space-x-2 text-sm">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <ChevronRight className="w-4 h-4 mx-2 text-light-text-tertiary dark:text-dark-text-tertiary" />
                        )}
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-light-text-primary dark:text-dark-text-primary font-medium">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
