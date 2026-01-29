import { execSync } from "child_process";
import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Get current branch
const currentBranch = execSync("git branch --show-current").toString().trim();

const allowedBranches = ["pre-prod", "prod"];
if (!allowedBranches.includes(currentBranch)) {
  console.log("❌ Not target branch, skipping changelog");
  process.exit(0);
}

// Detect source branch (previous branch before merge)
const sourceBranch =
  currentBranch === "pre-prod" ? "uat" :
  currentBranch === "prod" ? "pre-prod" :
  null;

// Get commit logs between branches
const commitLogs = execSync(
  `git log ${sourceBranch}..${currentBranch} --pretty=format:"%s"`
).toString().trim();

if (!commitLogs) {
  console.log("⚠ No commits found");
  process.exit(0);
}

// Get merge author
const author = execSync("git config user.name").toString().trim();
const date = new Date().toISOString().split("T")[0];

// OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = `
You are a senior release manager.
Convert these commit messages into a professional release note with emojis.

Commits:
${commitLogs}

Return markdown bullet list.
`;

async function run() {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const releaseNotes = res.choices[0].message.content;

  const header = `
---

## 🚀 Release on ${date}
**Merged by:** ${author}  
**Branch:** ${sourceBranch} → ${currentBranch}

${releaseNotes}

`;

  // Append to CHANGELOG.md
  if (fs.existsSync("CHANGELOG.md")) {
    fs.appendFileSync("CHANGELOG.md", header);
  } else {
    fs.writeFileSync("CHANGELOG.md", "# Changelog\n" + header);
  }

  console.log("✅ CHANGELOG.md updated!");
}

run();



// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: "",
// });

// const response = openai.responses.create({
//   model: "gpt-5-nano",
//   input: "write a haiku about ai",
//   store: true,
// });

// response.then((result) => console.log(result.output_text));