#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const BOILERPLATE_REPO = "mayurdodiya/create-mernapp";

const projectName = process.argv[2];

if (!projectName) {
  console.log("❌ Please provide a project name!");
  console.log("   Usage: npx @mayur-dodiya/create-mernapp my-project");
  process.exit(1);
}

const targetDir = path.resolve(process.cwd(), projectName);

if (fs.existsSync(targetDir)) {
  console.log(`❌ Folder "${projectName}" already exists!`);
  process.exit(1);
}

console.log(`\n🚀 Creating MERN app: ${projectName}...\n`);

try {
  execSync(`npx degit ${BOILERPLATE_REPO} ${projectName}`, { stdio: "inherit" });
  console.log("\n✅ Done! Your MERN app is ready!\n");
  console.log(`   cd ${projectName}`);
  console.log(`   cp .env.example .env`);
  console.log(`   npm install`);
  console.log(`   npm run dev\n`);
} catch (err) {
  console.error("❌ Failed:", err.message);
  process.exit(1);
}
