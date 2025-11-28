import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
};

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Only run during `next dev`
if (process.env.NODE_ENV === "development") {
    initOpenNextCloudflareForDev();
}

export default nextConfig;
