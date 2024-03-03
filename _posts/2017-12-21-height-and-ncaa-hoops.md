---
layout: post
title: "Height and NCAA Hoops"
date: 2017-12-21 00:00:00 -0000
categories: R
---

I’m hellbent on winning a March Madness pool this year, and have been reading up on modern basketball analytics (i.e., [KenPom](http://kenpom.com/), [Dean Oliver](http://www.basketballonpaper.com/author.html), [Sagarin](http://sagarin.com/sports/cbsend.htm), [Lopez](https://statsbylopez.com/2014/12/04/building-an-ncaa-mens-basketball-prediction-model/)).

In the process, I’ve played around with scraping data from various websites, to analyze in R.

This is a quick exploration of player height according to 2017-18 NCAA D-I Men’s Basketball Rosters.

### Average Height by Team
![Alt text](/docs/assets/images/ncaa-height-distribution.png)

D-I teams tend to be around `6'5"` in average height – 8 inches taller than the [average US adult male](https://www.cdc.gov/nchs/fastats/body-measurements.htm) at `5'9"`.

### 10 Tallest Conferences
Averaging the heights of players on each team’s roster:

| Conf | Average height |
|------|-----------------|
| ACC  | 6’5.73’’        |
| P12  | 6’5.72’’        |
| MWC  | 6’5.69’’        |
| B12  | 6’5.64’’        |
| B10  | 6’5.56’’        |
| BE   | 6’5.52’’        |
| Amer | 6’5.43’’        |
| SEC  | 6’5.39’’        |
| WCC  | 6’5.19’’        |
| MAC  | 6’5.07’’        |

There are `33` NCAA D-1 Conferences, and all of the perennial top-performers are among the tallest.

### 10 Shortest Conferences

| Conf | Average height |
|------|-----------------|
| NEC  | 6’3.8’’         |
| BSth | 6’3.94’’        |
| SC   | 6’3.99’’        |
| Slnd | 6’4.01’’        |
| OVC  | 6’4.3’’         |
| AE   | 6’4.31’’        |
| SWAC | 6’4.38’’        |
| MEAC | 6’4.39’’        |
| ASun | 6’4.42’’        |
| SB   | 6’4.49’’        |


At the time of this writing, not a single team from what I’ll now call the `Short 10 Consortium` is ranked in the Top 60 according to Kenpom, nor ESPN’s [BPI](http://www.espn.com/mens-college-basketball/bpi/_/view/bpi).

### Do taller teams tend to rebound, and block shots more than shorter teams?
![Alt text](/docs/assets/images/ncaa-height-trb-pct.png)
![Alt text](/docs/assets/images/ncaa-height-orb-pct.png)
![Alt text](/docs/assets/images/ncaa-height-block-pct.png)

Looks like there is a correlation between team height, rebounding, and especially block percentage. The particularly-tall, high-block percentage team is one of my favorites: `Syracuse`.




