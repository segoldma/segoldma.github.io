---
title: "dbt Run Results Visualizer"
date: 2024-12-27
description: "An interactive visualization tool for analyzing dbt model execution times"
tags: ["dbt", "data", "visualization"]
collection: tools
emoji: 📊
---

This interactive tool helps analyze the execution timeline of your dbt models. Locate your `run_results.json` file (typically in the `target/` directory) to see a detailed Gantt chart of your execution times.

{% include dbt-visualizer.html %}

This visualization is entirely client-side, so it should be fast, and does not share any data to me whatsoever.