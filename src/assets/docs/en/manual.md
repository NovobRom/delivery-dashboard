# Delivery Dashboard — User Manual

## Welcome

Welcome to **Delivery Dashboard** — your analytics tool for monitoring last-mile delivery performance, courier efficiency, and regional trends. This guide will help you get started and make the most of every feature.

---

## Getting Started

### Uploading Data

1. Click the **"Upload CSV/Tab File"** button in the top-right corner of the header.
2. Select a `.csv` or `.txt` file containing your delivery report.
3. The dashboard will automatically parse the file and display your data.

### Expected File Format

The file must be **tab-separated** (TSV) or **comma-separated** (CSV) with the following columns:

| # | Column | Description | Example |
|---|---|---|---|
| 1 | **№** | Row number | `1` |
| 2 | **Report Date** | Date of the delivery report (`DD.MM.YYYY`) | `02.01.2026` |
| 3 | **Courier Name** | Courier identifier | `dinul.a` |
| 4 | **Vehicle Number** | Vehicle registration plate | `NO9230Y` |
| 5 | **Region / Depot** | Depot or regional subdivision name | `RIGA 1` |
| 6 | **Report Count** | Number of delivery reports for this entry | `1` |
| 7 | **Addresses** | Number of unique delivery addresses | `19` |
| 8 | **Loaded Parcels** | Total parcels loaded for delivery | `20` |
| 9 | **Delivered** | Total parcels successfully delivered | `15` |
| 10 | **Hand Delivery** | Parcels delivered directly to the recipient | `15` |
| 11 | **SafePlace** | Parcels left at a designated safe place | `0` |
| 12 | **Undelivered** | Total parcels not delivered | `5` |
| 13 | **With Reason** | Undelivered parcels with a specified reason | `5` |
| 14 | **No Reason** | Undelivered parcels without any reason given | `0` |
| 15 | **Success Rate** | Percentage of parcels delivered | `75.00%` |

> **Tip:** The first row must contain column headers. The system auto-detects whether your file uses tabs or commas as delimiters.

---

## Dashboard Guide

### KPI Cards

At the top of the dashboard you'll find four key performance indicator cards:

- **Total Parcels Loaded** — The total number of parcels loaded for delivery in the selected period.
- **Successfully Delivered** — How many of those parcels reached their destination, with the success rate shown as a percentage.
- **Undelivered (No Reason)** — Parcels returned without any documented reason. A high number here requires immediate attention.
- **Active Couriers** — The number of unique couriers who had at least one delivery report in the period.

### Charts

#### Success Rate Trend
An area chart showing how the delivery success rate changes over time. Use the **Daily / Weekly / Monthly** toggle above the chart to adjust the aggregation level.

#### Regional Comparison
A bar chart comparing success rates across all active regions. Taller bars mean better performance. Use this to spot underperforming depots at a glance.

#### Courier Productivity Heatmap
A color-coded matrix where:
- **Rows** represent couriers
- **Columns** represent dates
- **Cell color** indicates the success rate (green = high, red = low)

This helps identify patterns — for example, a courier who consistently underperforms on specific days.

#### Exception Analysis (No Reason)
A bar chart ranking couriers by the number of parcels returned without a reason. Focus on the top bars to prioritize follow-up.

#### Delivery Method Breakdown
Shows the proportion of deliveries made by hand, via SafePlace, or left undelivered. Useful for understanding delivery behavior trends.

### Filters

- **Region filter** (header) — Select one or more regions/depots to focus on.
- **Date filter** (header) — Choose a preset range (This Month, Last 7 Days, etc.) or set a custom date range.
- **Courier filter** — Available in the leaderboard section to search for specific couriers.

---

## FAQ & Troubleshooting

### My file doesn't load — what should I do?

1. **Check the format:** Ensure the file is `.csv` or `.txt` with tab or comma delimiters.
2. **Verify the columns:** The file must contain the expected columns in the correct order (see the table above).
3. **Check the encoding:** The file should be saved in UTF-8 encoding.
4. **Check the date format:** Dates must follow `DD.MM.YYYY` format.
5. **Try a smaller file:** If the file is very large (100,000+ rows), try splitting it into smaller chunks.

### The charts show no data after upload

- Make sure the **date filter** in the header isn't set to a range that excludes your data.
- Check that at least one **region** is selected (or use "Select All").

### How do I switch languages?

Click the language toggle button (🇬🇧 EN / 🇺🇦 UA) in the header. Your preference is saved automatically.

---

*© 2026 Roman Novobranets. All rights reserved.*
