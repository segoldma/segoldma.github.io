---
layout: post
title: "Using an API to get College Football Data"
date: 2019-08-17 00:00:00 -0000
categories: ncaa, football, rstats, api
---

As I’ve started to interact with more web data at work, I’ve felt the need to get more familiar with third-party APIs. Since the college football season kicks off next weekend, I’m writing this post as I experiment with the (seemingly) simple [CollegeFootballData.com](http://collegefootballdata.com/) API for the first time.

The CollegeFootballData.com website has a nice interface for running reports on teams, games, drives, plays, recruiting, and more. However, some of these datasets, like plays, are very granular, which means that pulling out a full season’s worth of plays would require exporting one week of data at a time, and mashing them together in another tool. By using [the API](https://api.collegefootballdata.com/), I will probably still have to pull the data a week at a time, though it should be a more streamlined workflow than the more manual alternative. I guess that’s kind of the point of APIs.

### Preparation

I’ll be using a couple of R packages that help work with web data:
- [httr](https://cran.r-project.org/web/packages/httr): to interact with the API
- [jsonlite](https://cran.r-project.org/web/packages/jsonlite/): to parse the response data

### Extracting Play Data

First, I’ll send a request to the CFBData API to get play-level data from last season. Reviewing the documentation for the [/plays](https://api.collegefootballdata.com/api/docs/?url=/api-docs.json#/plays/getPlays) endpoint, it seems like I can specify a number of parameters in my request (e.g., year, week, team, play type, etc.)

I’ve built the path object in the code chunk below using these parameters:
- `seasonType`: regular season
- `year`: 2018 season
- `1`: 1

I’ll use the httr package to send a `GET` request using this absolute path, and call the response r. Next, I’ll check the http status of the response to make sure we can play nice with the server.

<script src="https://gist.github.com/segoldma/2375c38b4a8810032b48198b4b142bab.js"></script>

### Parsing the Response

So far, so good. Next, I want to actually see the data I requested: play data from Week 1 of the 2018 CFB season.

I’ll call `httr::content()` on the response object, with results in text format. Then I’ll use `substring` to preview the first 500 characters of the response, which should be in [JSON format](https://www.json.org/).

<script src="https://gist.github.com/segoldma/2cce22916794454a326f7bbc0b891963.js"></script>

### Converting the JSON into a Table

Seems like that worked. The last step will be to convert the `r_content` response object from its JSON format to a tabular format. To do so, I’ll use the `jsonlite::fromJSON()` function, and store the result as r_tbl. Finally, I’ll examine `r_tbl` using `dim()` and `summary()`.

<script src="https://gist.github.com/segoldma/b4363182e8e3059ce0fbf2fd15de697f.js"></script>


### Wrapping Up

That was pretty easy. Later on, I’ll create some R functions that take the API’s parameters as inputs, and produce the correctly-formatted URL as output. This will help further abstract this process, and allow me to get a dataframe full of glorious college football data with just one line of code. After that, I’ll try to iterate over this function with a series of parameters, in order to capture a season or multiple season’s worth of data in one fell swoop.

Thanks to [College Football Data](https://arc.net/l/quote/xsmjihes) for their API, and to [Hadley Wickham](http://twitter.com/hadleywickham), and [RStudio](https://arc.net/l/quote/alosawfh) for their power tools.

