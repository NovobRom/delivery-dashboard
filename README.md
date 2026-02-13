<div align="center">

# 📦 Delivery Dashboard

**An analytics platform for logistics companies to visualize delivery performance, courier efficiency, and regional trends.**

*Developed by **Roman Novobranets***

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-All_Rights_Reserved-red?style=flat-square)]()

</div>

---

## 🔍 Overview

Managing last-mile delivery operations at scale is challenging. Logistics managers need to quickly identify delayed shipments, evaluate courier productivity, and spot underperforming regions — all without drowning in spreadsheets.

**Delivery Dashboard** solves this by transforming raw CSV/TSV data into actionable insights through interactive KPI cards, trend charts, heatmaps, and leaderboards. Upload your daily report, apply filters, and instantly see where your delivery network excels — and where it needs attention.

## ✨ Features

| Feature | Description |
|---|---|
| **KPI Cards** | At-a-glance metrics — total parcels, success rate, undelivered exceptions, active couriers |
| **Dynamic Filtering** | Filter by date range (preset or custom), region, and courier |
| **Volume Trends** | Area chart tracking daily/weekly/monthly delivery volumes |
| **Regional Comparison** | Bar chart comparing success rates across all active regions |
| **Courier Heatmap** | Color-coded matrix revealing courier performance patterns over time |
| **Exception Analysis** | Identify couriers with the highest "no reason" return rates |
| **Delivery Methods** | Breakdown of hand-delivery vs. SafePlace vs. undelivered |
| **Courier Leaderboard** | Sortable table with detailed per-courier statistics |
| **Period Summary** | Median rate, best/worst day, and date-range statistics |
| **Dark / Light Mode** | Full dark mode support across all components |
| **Multi-language** | English 🇬🇧 and Ukrainian 🇺🇦 with i18next |
| **Glassmorphism UI** | Modern frosted-glass design with smooth animations |

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 |
| **Language** | TypeScript 5.3 |
| **Bundler** | Vite 5 |
| **Styling** | Tailwind CSS 3.4 (Glassmorphism design) |
| **State Management** | Zustand 4 |
| **Charts** | Recharts 2 |
| **Icons** | Lucide React |
| **Internationalization** | i18next + react-i18next |
| **Data Parsing** | PapaParse (CSV/TSV) |
| **Validation** | Zod |
| **Date Utilities** | date-fns |

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **npm** (ships with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/NovobRom/delivery-dashboard.git
cd delivery-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will open at `http://localhost:3000`.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint across the codebase |

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/          # Recharts visualizations
│   │   ├── CourierHeatmap.tsx
│   │   ├── DeliveryMethodChart.tsx
│   │   ├── ExceptionAnalysis.tsx
│   │   ├── RegionalComparisonChart.tsx
│   │   └── VolumeTrendChart.tsx
│   ├── common/          # Reusable UI primitives
│   │   ├── DateFilter.tsx
│   │   ├── GlassCard.tsx
│   │   ├── MultiSelect.tsx
│   │   ├── StatCard.tsx
│   │   └── ...
│   ├── features/        # Feature modules
│   │   └── Dashboard/
│   │       ├── Dashboard.tsx
│   │       ├── KPISection.tsx
│   │       └── SummaryPanel.tsx
│   └── layout/          # App shell
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── MainLayout.tsx
├── config/              # Constants & configuration
├── i18n/                # Locales (en.json, uk.json)
├── store/               # Zustand state stores
├── types/               # TypeScript interfaces
├── utils/               # Data parsing & calculations
├── workers/             # Web Workers (planned)
└── styles/              # Global CSS
```

## 🔢 Versioning Policy

This project follows **[Semantic Versioning (SemVer)](https://semver.org/)** — `MAJOR.MINOR.PATCH`.

| Bump | When | Example |
|---|---|---|
| **Major** (`X.0.0`) | Breaking changes or complete redesigns | Rewritten data pipeline, new incompatible CSV format |
| **Minor** (`0.Y.0`) | New backward-compatible features | New chart type, additional filter, new language |
| **Patch** (`0.0.Z`) | Bug fixes & minor improvements | Text corrections, performance tweaks, style fixes |

> **Current version:** `10.0.0`

## 📄 License

© 2026 Roman Novobranets. All rights reserved.

---

<div align="center">
  <sub>Built with ❤️ by <strong>Roman Novobranets</strong></sub>
</div>
