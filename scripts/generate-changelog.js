// const { execSync } = require("child_process");
// const fs = require("fs");
// const path = require("path");
// require("dotenv").config();
// const { GoogleGenerativeAI } = require("@google/generative-ai");

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";


// Current branch
const currentBranch = execSync("git branch --show-current").toString().trim();
const allowedBranches = ["pre-prod", "prod"];

if (!allowedBranches.includes(currentBranch)) {
  console.log("❌ Not target branch");
  process.exit(0);
}

// Get commits from last merge (works for fast-forward too)
let commitLogs = "";
try {
  commitLogs = execSync(
    `git log HEAD@{1}..HEAD --pretty=format:"%s"`
  ).toString().trim();
} catch (e) {
  console.log("⚠ No commits detected");
  process.exit(0);
}

if (!commitLogs) {
  console.log("⚠ No commits found");
  process.exit(0);
}

// Meta info
const author = execSync("git config user.name").toString().trim();
const date = new Date().toISOString().split("T")[0];

// Gemini Client
const genAI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
// console.logprocess.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

const prompt = `
You are a senior release manager.
Convert these git commit messages into a professional release note with emojis.

Commits:
${commitLogs}

Return markdown bullet list only.
`;

async function run() {
  const result = await model.generateContent(prompt);
  const releaseNotes = result.response.text();

  const header = `
---

## 🚀 Release on ${date}
**Merged by:** ${author}  
**Branch:** ${currentBranch}

${releaseNotes}

`;

  const changelogPath = path.resolve(process.cwd(), "CHANGELOG.md");

  if (fs.existsSync(changelogPath)) {
    fs.appendFileSync(changelogPath, header);
  } else {
    fs.writeFileSync(changelogPath, "# Changelog\n" + header);
  }

  console.log("✅ CHANGELOG.md updated at project root!");
}

run();



// const { execSync } = require("child_process");
// const fs = require("fs");
// const path = require("path");
// const OpenAI = require("openai");
// require("dotenv").config();

// // Current branch
// const currentBranch = execSync("git branch --show-current").toString().trim();
// const allowedBranches = ["pre-prod", "prod"];

// if (!allowedBranches.includes(currentBranch)) {
//   console.log("❌ Not target branch");
//   process.exit(0);
// }

// // Get last merge commits (works with fast-forward)
// let commitLogs = "";
// try {
//   commitLogs = execSync(
//     `git log HEAD@{1}..HEAD --pretty=format:"%s"`
//   ).toString().trim();
// } catch (e) {
//   console.log("⚠ No commits detected");
//   process.exit(0);
// }

// if (!commitLogs) {
//   console.log("⚠ No commits found");
//   process.exit(0);
// }

// const author = execSync("git config user.name").toString().trim();
// const date = new Date().toISOString().split("T")[0];

// // OpenAI
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const prompt = `
// You are a senior release manager.
// Convert these commit messages into beautiful release notes with emojis.

// Commits:
// ${commitLogs}

// Return markdown.
// `;

// async function run() {
//   const res = await openai.chat.completions.create({
//     model: "gpt-4.1-mini",
//     messages: [{ role: "user", content: prompt }],
//   });

//   const releaseNotes = res.choices[0].message.content;

//   const header = `
// ---

// ## 🚀 Release on ${date}
// **Merged by:** ${author}
// **Branch:** ${currentBranch}

// ${releaseNotes}

// `;

//   const changelogPath = path.resolve(process.cwd(), "CHANGELOG.md");

//   if (fs.existsSync(changelogPath)) {
//     fs.appendFileSync(changelogPath, header);
//   } else {
//     fs.writeFileSync(changelogPath, "# Changelog\n" + header);
//   }

//   console.log("✅ CHANGELOG.md updated at project root!");
// }

// run();
