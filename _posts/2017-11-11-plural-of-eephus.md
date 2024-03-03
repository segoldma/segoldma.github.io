---
layout: post
title: "What's the plural of eephus?"
date: 2017-11-11 00:00:00 -0000
categories: R
---

I downloaded a fairly large amount of pitch data from the [MLB Statcast](https://baseballsavant.mlb.com/statcast_search) database: every pitch thrown during the 2017 season, with ~75 variables about each.

### What’s the plural of Eephus?
For the uninitiated, the [Eephus](https://en.wikipedia.org/wiki/Eephus_pitch) pitch is a very, very slow baseball pitch. I’d hoped that the plural of eephus would be eephucies (like matrices), but it turns out isn’t a real word at all. As far as I can tell from the [Google Ngram](https://books.google.com/ngrams/graph?content=eephus&year_start=1800&year_end=2000&corpus=15&smoothing=3&share=&direct_url=t1%3B%2Ceephus%3B%2Cc0#t1%3B%2Ceephus%3B%2Cc1) viewer, it was first used in a baseball context around 1960. More on eephuses/eephucies later.

### Which teams threw the hardest on average?

<script src="https://gist.github.com/segoldma/3e7301e285cefdb6c341e4a9b504e2fb.js"></script>

Eight of the top ten hardest throwing teams are in the National League, but since these rankings are likely buoyed by the relative velocity of fastballs thrown, I wanted to re-run the list by `fastballs` alone.

### Which teams threw the fastest fastballs? (Part 1)

<script src="https://gist.github.com/segoldma/1243841c7d27ab625fa4a2a7ff325b59.js"></script>

Since there was a bit of variance between the overall velocity and fastball velocity rankings, I wanted to get a sense of the MLB-wide velocity by `pitch type`. I didn’t remove the Null or `unknown` pitch types from the dataset, but I am curious as to how `AJ Ramos` chucked `11` nulls during the 2017 season.

### Average velocity by pitch type

<script src="https://gist.github.com/segoldma/956729f9bce4c5ed7c1a2065ce55a352.js"></script>

Back to fastball velocity, I created a [Cleveland plot](https://www.jstor.org/stable/2288400) to visualize the aggregated averages of Four-Seam Fastball, Two-Seam Fastball, and Sinker, by team.

### Which teams threw the fastest fastballs? (Part 2)

![Alt text](/docs/assets/images/eephus-fastest-team-fastball.png)

### Pitch velocity by team (by common pitch type)

Since the cleveland plot is a nice way to compare pitch velocity by team, I added a couple of additional common pitch types:

- Four-Seam Fastball
- Slider
- Change-up
- Curveball

![Alt text](/docs/assets/images/eephus-avg-velo-by-pitch.png)

Before turning my attention back to eephuses, I wondered how fastball velocities varied by inning.

### Fastball velocity by Inning

![Alt text](/docs/assets/images/eephus-avg-fb-velo-by-inning.png)

Looks like the starting pitcher’s velocity tends to fall off as they pitch deeper into a game. As relief pitchers enter the game, the average fastball velocities shoot up. Just a hunch: the velocities between the `5th` and `8th innings` are equally affected by each game’s innings pitched by starting pitchers and the timing of the typically hard-throwing relief pitchers entering the game. In other words, I’d predict that the average starting pitcher’s `IP` is around `5 innings`, which is when the average fastball velocity starts to increase.

### Eephuses/Eephucies
There were `147` eephuses thrown during the 2017 regular season.


#### Who threw them?

<script src="https://gist.github.com/segoldma/e248845c15b0a76bf32c116531e5af95.js"></script>


RA Dickey makes sense, being a knuckleballer, but I was surprised by James Shields. The [Chicago Sun-Times](https://chicago.suntimes.com/sports/slower-is-better-for-the-reinvented-james-shields/) wrote about Shields’ `curveball` registering as an `eephus` early in the season, so these pitches may have been miscoded by `Statcast`.

#### Were they balls, strikes, or put in-play?

<script src="https://gist.github.com/segoldma/68084f9632d78c0668a7a00e906ccc39.js"></script>

The `x` denotes an `eephus` put in play by the batter… `16%`` of eephuses were batted into play.

#### What were the outcomes of eephuses put in-play?

<script src="https://gist.github.com/segoldma/4710a9e234284283fe15daa7d98d7c5c.js"></script>

Shout-out to `Jose Peraza` for hitting the 2017 season’s only `HR` off of an Eephus.
