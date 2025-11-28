import { Metadata } from "next";
import { Mail, Globe } from "lucide-react";

export const metadata: Metadata = {
    title: "About Toolsail | Discover the Best AI & Digital Tools",
    description:
        "Learn about Toolsail - your curated directory for discovering premium AI and digital tools",
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                        About Toolsail
                    </h1>
                    <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
                        Your curated directory for discovering the best AI and
                        digital tools
                    </p>
                </div>

                {/* Mission */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-6">
                        Our Mission
                    </h2>
                    <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary leading-relaxed mb-4">
                        Toolsail was created to solve a simple problem: finding
                        the right tool among thousands of options is
                        overwhelming. We carefully curate and review AI and
                        digital tools to help you discover solutions that truly
                        add value to your work and life.
                    </p>
                    <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary leading-relaxed">
                        Every tool listed on Toolsail undergoes manual review to
                        ensure quality, relevance, and authenticity. Our goal is
                        to be your trusted guide in the ever-expanding world of
                        digital tools.
                    </p>
                </section>

                {/* What We Do */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-6">
                        What We Do
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-6 border border-light-border dark:border-dark-border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary">
                            <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                                Curated Directory
                            </h3>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                Hand-picked collection of 1000+ premium AI and
                                digital tools across various categories.
                            </p>
                        </div>
                        <div className="p-6 border border-light-border dark:border-dark-border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary">
                            <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                                Expert Reviews
                            </h3>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                In-depth tool comparisons and guides to help you
                                make informed decisions.
                            </p>
                        </div>
                        <div className="p-6 border border-light-border dark:border-dark-border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary">
                            <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                                Community Submissions
                            </h3>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                Anyone can submit tools for review, helping us
                                discover hidden gems.
                            </p>
                        </div>
                        <div className="p-6 border border-light-border dark:border-dark-border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary">
                            <h3 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                                Educational Content
                            </h3>
                            <p className="text-light-text-secondary dark:text-dark-text-secondary">
                                Blog posts with tutorials, best practices, and
                                productivity tips.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact */}
                <section className="mb-12 p-8 border border-light-border dark:border-dark-border rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary">
                    <h2 className="text-3xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-6">
                        Get in Touch
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                            <a
                                href="mailto:contact@toolsail.top"
                                className="text-light-text-primary dark:text-dark-text-primary hover:opacity-70 transition-opacity"
                            >
                                contact@toolsail.top
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Globe className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
                            <a
                                href="https://toolsail.top"
                                className="text-light-text-primary dark:text-dark-text-primary hover:opacity-70 transition-opacity"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                toolsail.top
                            </a>
                        </div>
                    </div>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary mt-6">
                        Have a tool to submit? Questions about our platform?
                        We'd love to hear from you!
                    </p>
                </section>
            </div>
        </div>
    );
}
