import { existsSync } from "node:fs";

const requiredFiles = [
  "dist/index.html",
  "dist/about/index.html",
  "dist/services/index.html",
  "dist/blog/index.html",
  "dist/contact/index.html",
  "dist/assets/site.css",
  "dist/assets/site.js",
  "dist/assets/abhinav-shrestha-logo.png",
  "dist/assets/hero-section.jpg",
  "dist/assets/ai-marketing-consultant.png",
];

const missingFiles = requiredFiles.filter((file) => !existsSync(file));

if (missingFiles.length > 0) {
  throw new Error(`The Vercel static build is incomplete. Missing: ${missingFiles.join(", ")}`);
}

console.log("Verified the complete portfolio in dist for Vercel deployment.");
