# ClaimTrace

> **Deconstruct social posts into attributed statements.** Distinguish personal experience, verifiable data, direct observation, interpretation/opinion, and external citations with real-time interactive ground truth verification.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8.svg)](https://tailwindcss.com/)

---

## 🌟 Overview

ClaimTrace helps readers critically analyze complex social media statements, threads, and viral articles by breaking down continuous text into granular, color-coded statements categorized under a clear epistemic taxonomy:

- 🟢 **Direct Observation / Personal Experience**: First-person accounts and primary empirical witness statements.
- 🔵 **Data / Empirical Finding**: Measurable statistics, benchmarks, study results, and quantitative claims with source citations.
- 🟡 **Interpretation / Analysis**: Analytical commentary, projections, and contextual conclusions drawn from evidence.
- 🟣 **Value Judgment / Opinion**: Subjective takes, perspectives, and normative claims.
- 🔴 **Disputed / Unsubstantiated**: Unverified rumors, debunked assertions, or claims lacking verifiable sources.

---

## ✨ Features

- **Ambient Reading Progress**: Subtle sticky top progress indicator showing real-time statement completion and time estimates as you read long posts.
- **Statement Deconstruction**: Seamless switching between formatted prose and granular card-by-card statement views.
- **Interactive Citation Linking**: Hover and click claims to highlight underlying evidence, studies, and source links in the interactive references drawer.
- **Dynamic Post Creation & Editing**: Deconstruct new posts, assign taxonomy badges, add primary source URLs, and publish verification threads.
- **Dark & Light Mode**: Accessible, low-fatigue typography and high-contrast styling across both light and dark themes.
- **Mobile-First Responsive Layout**: Optimized font scales, readable cards, and touch-friendly targets across phones, tablets, and desktops.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, React Router v7
- **Styling**: Tailwind CSS v4, Lucide React Icons, Motion
- **Tooling**: Vite, Bun / Node.js

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+) or Bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd claimtrace

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will start at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

---

## 📄 License

This project is licensed under the MIT License.
