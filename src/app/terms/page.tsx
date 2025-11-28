import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | Toolsail",
    description: "Toolsail terms of service and usage guidelines",
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-8">
                    Terms of Service
                </h1>

                <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-light-text-secondary dark:text-dark-text-secondary text-lg mb-6">
                        Last updated:{" "}
                        {new Date().toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            By accessing and using Toolsail ("the Service"), you
                            accept and agree to be bound by these Terms of
                            Service. If you do not agree to these terms, please
                            do not use our Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            2. Description of Service
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                            Toolsail is a curated directory of AI and digital
                            tools. We provide:
                        </p>
                        <ul className="list-disc pl-6 text-light-text-secondary dark:text-dark-text-secondary space-y-2">
                            <li>A searchable database of tools</li>
                            <li>Tool reviews and comparisons</li>
                            <li>User-submitted tool listings</li>
                            <li>Educational blog content</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            3. User Responsibilities
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                            When submitting tools or content, you agree to:
                        </p>
                        <ul className="list-disc pl-6 text-light-text-secondary dark:text-dark-text-secondary space-y-2">
                            <li>Provide accurate and truthful information</li>
                            <li>Not submit spam or malicious content</li>
                            <li>Respect intellectual property rights</li>
                            <li>
                                Comply with all applicable laws and regulations
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            4. Content Moderation
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            We reserve the right to review, approve, or reject
                            any tool submissions. We may also remove content
                            that violates these terms or our community
                            guidelines.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            5. Limitation of Liability
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            Toolsail is provided "as is" without warranties of
                            any kind. We are not responsible for the accuracy,
                            quality, or availability of third-party tools listed
                            on our platform.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            6. Changes to Terms
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            We may modify these terms at any time. Continued use
                            of the Service constitutes acceptance of any
                            changes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            7. Contact Information
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            For questions about these Terms of Service, contact
                            us at:{" "}
                            <a
                                href="mailto:contact@toolsail.top"
                                className="text-light-text-primary dark:text-dark-text-primary underline hover:opacity-70"
                            >
                                contact@toolsail.top
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
