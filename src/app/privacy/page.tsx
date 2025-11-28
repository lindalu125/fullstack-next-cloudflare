import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Toolsail",
    description: "Toolsail privacy policy and data protection information",
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-8">
                    Privacy Policy
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
                            1. Information We Collect
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                            At Toolsail, we collect minimal information
                            necessary to provide our services. This may include:
                        </p>
                        <ul className="list-disc pl-6 text-light-text-secondary dark:text-dark-text-secondary space-y-2">
                            <li>
                                Email addresses for tool submission
                                notifications
                            </li>
                            <li>Usage data through analytics (anonymized)</li>
                            <li>Cookies for essential site functionality</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            2. How We Use Your Information
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                            We use collected information to:
                        </p>
                        <ul className="list-disc pl-6 text-light-text-secondary dark:text-dark-text-secondary space-y-2">
                            <li>
                                Process tool submissions and send verification
                                emails
                            </li>
                            <li>Improve our website and user experience</li>
                            <li>
                                Communicate important updates about our services
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            3. Data Protection
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            We implement appropriate security measures to
                            protect your personal information. Your data is
                            stored securely and is never sold to third parties.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            4. Third-Party Services
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            Our website uses Google AdSense for advertising.
                            These services may collect cookies and usage data
                            according to their own privacy policies.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
                            5. Contact Us
                        </h2>
                        <p className="text-light-text-secondary dark:text-dark-text-secondary">
                            If you have any questions about this Privacy Policy,
                            please contact us at:{" "}
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
