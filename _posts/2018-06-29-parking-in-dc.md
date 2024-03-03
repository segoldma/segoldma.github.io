---
layout: post
title: "Parking Violations in DC"
date: 2018-06-29 00:00:00 -0000
categories: rstats, ggplot2, dc
---

I have very few complaints about living in Washington, D.C., but if I were forced to pick one, it’d be searching for on-street parking. When I found the several public [Parking Violations](http://opendata.dc.gov/datasets?q=Parking%20Violations&sort=-updatedAt) on [Open Data DC](http://opendata.dc.gov/), I figured I might be able to extract some insights into the best (and worst) blocks to look for a spot during high-demand times.

My original intent was to try to model the parking violations to identify the optimal times and locations of available parking spots near my house. I found the `ISSUE_TIME` data to be suspicious, and settled on doing a quick exploratory analysis of the data instead.


---


DC Department of Transportation ([DDOT](http://ddot.dc.gov/)) publishes Parking Violations by Month. I downloaded the past year of monthly datasets and loaded them into R:

Exploring the structure of the dataset with summary:
<script src="https://gist.github.com/segoldma/8042019a4240fe4bc0fc765e65d111be.js"></script>

**Exploring missing values:**
Specifically, violation descriptions, violation locations, and violation time/date:

| Missing Descriptions | Missing Locations | Missing Date | Total Observations |
|-----------------------|---------------------|--------------|--------------------|
| 27,096                | 0                   | 0            | 1,353,955          |


Slightly more than 3% of violations have no `VIOLATION_DESCRIPTION`, however, they are each reported with a `VIOLATION CODE`, summarized below:

| VIOLATION_CODE | Violations |
|-----------------|------------|
| P076            | 26,799     |
| NO VIOL         | 278        |
| P071            | 6          |
| P187            | 6          |
| P067            | 2          |
| P178            | 2          |
| P00             | 1          |
| P139            | 1          |
| P189            | 1          |


It seems like `P076` is a “[ROSA Warning](https://dmv.dc.gov/sites/default/files/dc/sites/dmv/publication/attachments/AdjudicationDispositionRptJan2011.pdf),” which stands for Registration of Out-of-State Automobiles. Some of the other codes were hard to find, although P187 maps to… “ROLLERBLADEINFREEDOM.” [Soul Skaters?](https://www.imdb.com/title/tt0162212/)

For the rest of the exploration, I’ve replaced the missing `P076` Violation Description values with `ROSA WARNING`.

### Top 10 violations by description
![Alt text](/docs/assets/images/dc-parking-top-violations.png)

### Parking Violations by Month
![Alt text](/docs/assets/images/dc-parking-violations-by-month.png)

### Top 10 Violation Locations

| LOCATION                             | Violations |
|--------------------------------------|------------|
| 3200 BLOCK WATER ST NW SOUTH SIDE    | 3540       |
| 1300 BLOCK H ST NE SOUTH SIDE        | 2930       |
| 1300 BLOCK G ST NW SOUTH SIDE        | 2641       |
| 1300 BLOCK CONNECTICUT AVE NW EA     | 2494       |
| 1300 BLOCK F ST NW NORTH SIDE        | 2372       |
| 1300 BLOCK G ST NW NORTH SIDE        | 2279       |
| 900 BLOCK K ST NW NORTH SIDE         | 2075       |
| 700 BLOCK 7TH ST NW WEST SIDE        | 2039       |
| 1300 BLOCK H ST NE NORTH SIDE        | 1977       |
| 1400 BLOCK OKIE ST NE SOUTH SIDE     | 1967       |
| 1600 BLOCK K ST NW SOUTH SIDE        | 1967       |

### Violations by Day of the Week
![Alt text](/docs/assets/images/dc-parking-violations-by-dow.png)

### Most Common Violation on each Day of the Week

| Day       | VIOLATION_DESCRIPTION                      |
|-----------|--------------------------------------------|
| Friday    | FAIL TO DISPLAY A MULTISPACE METER RECEIPT |
| Monday    | NO PARKING STREET CLEANING                 |
| Saturday  | FAIL TO DISPLAY A MULTISPACE METER RECEIPT |
| Sunday    | NO PARKING ANYTIME                         |
| Thursday  | FAIL TO DISPLAY A MULTISPACE METER RECEIPT |
| Tuesday   | FAIL TO DISPLAY A MULTISPACE METER RECEIPT |
| Wednesday | FAIL TO DISPLAY A MULTISPACE METER RECEIPT |


### Violations by License Plate State
Top 10, in descending order
![Alt text](/docs/assets/images/dc-parking-license-state.png)

| State | Violations | Percentage |
|-------|------------|------------|
| MD    | 482,757    | 35.7%      |
| DC    | 388,274    | 28.7%      |
| VA    | 315,116    | 23.3%      |
| PA    | 17,515     | 1.3%       |
| FL    | 14,833     | 1.1%       |
| NY    | 13,359     | 1.0%       |
| NC    | 12,649     | 0.9%       |
| NJ    | 12,163     | 0.9%       |
| NA    | 10,347     | 0.8%       |
| TX    | 10,084     | 0.7%       |

[Crabcakes and parking violations](https://www.imdb.com/title/tt0396269/quotes/qt0329784), that’s what Maryland does.


