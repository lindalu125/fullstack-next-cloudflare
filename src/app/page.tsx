import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";

/**
 * Home Page
 * Landing page with hero section and featured categories
 */
export default function HomePage() {
    const categories = [
        {
            name: "AI Writing",
            slug: "ai-writing",
            icon: "✍️",
            count: 45,
            description: "AI-powered content generation",
        },
        {
            name: "AI Design",
            slug: "ai-design",
            icon: "🎨",
            count: 38,
            description: "Creative AI tools",
        },
        {
            name: "AI Coding",
            slug: "ai-coding",
            icon: "💻",
            count: 52,
            description: "Development assistants",
        },
        {
            name: "Design Tools",
            slug: "design-tools",
            icon: "🖌️",
            count: 67,
            description: "Professional design software",
        },
        {
            name: "Productivity",
            slug: "productivity",
            icon: "⚡",
            count: 89,
            description: "Boost your efficiency",
        },
        {
            name: "Developer Tools",
            slug: "developer-tools",
            icon: "🛠️",
            count: 74,
            description: "Essential dev tools",
        },
    ];

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-light-bg-primary dark:bg-dark-bg-primary py-20 sm:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium mb-8">
                            <Sparkles className="w-4 h-4" />
                            <span>1000+ Curated Tools</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-light-text-primary dark:text-dark-text-primary mb-6">
                            Discover the Best{" "}
                            <span className="text-light-text-primary dark:text-dark-text-primary">
                                AI & Digital Tools
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg sm:text-xl text-light-text-secondary dark:text-dark-text-secondary mb-10 max-w-2xl mx-auto">
                            A curated directory of premium tools to boost your
                            productivity, creativity, and innovation.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto mb-8">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                                <input
                                    type="text"
                                    placeholder="Search for tools..."
                                    className="w-full pl-12 pr-4 py-4 rounded-md border border-light-border dark:border-dark-border bg-light-bg-primary dark:bg-dark-bg-secondary focus:outline-none focus:ring-2 focus:ring-light-text-primary dark:focus:ring-dark-text-primary focus:border-transparent text-lg"
                                />
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/ai-tools"
                                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-light-bg-primary dark:text-dark-bg-primary bg-light-text-primary dark:bg-dark-text-primary rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Explore AI Tools
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link
                                href="/submit"
                                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-light-text-primary dark:text-dark-text-primary bg-transparent border border-light-border dark:border-dark-border rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                            >
                                Submit Your Tool
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-16 bg-light-bg-secondary dark:bg-dark-bg-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                            Browse by Category
                        </h2>
                        <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
                            Find the perfect tool for your needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/${category.slug}`}
                                className="group p-6 rounded-lg border border-light-border dark:border-dark-border hover:border-light-text-primary dark:hover:border-dark-text-primary transition-all hover:shadow-md bg-light-bg-primary dark:bg-dark-bg-primary hover:scale-[1.02]"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="text-4xl">
                                        {category.icon}
                                    </div>
                                    <span className="px-3 py-1 text-sm font-medium border border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary rounded-full">
                                        {category.count} tools
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
                                    {category.name}
                                </h3>
                                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                                    {category.description}
                                </p>
                                <div className="flex items-center text-light-text-primary dark:text-dark-text-primary font-medium group-hover:translate-x-1 transition-transform">
                                    Explore
                                    <ArrowRight className="ml-1 w-4 h-4" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-light-text-primary dark:bg-dark-text-primary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-light-bg-primary dark:text-dark-bg-primary mb-4">
                        Have a Tool to Share?
                    </h2>
                    <p className="text-xl text-light-text-tertiary dark:text-dark-text-tertiary mb-8 max-w-2xl mx-auto">
                        Submit your tool to Toolsail and reach thousands of
                        users looking for great solutions.
                    </p>
                    <Link
                        href="/submit"
                        className="inline-flex items-center px-8 py-3 text-base font-semibold text-light-text-primary dark:text-dark-text-primary bg-light-bg-primary dark:bg-dark-bg-primary rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors"
                    >
                        Submit Your Tool
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
