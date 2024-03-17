---
layout: post
title: "Catching up on the Tidyverse"
date: 2020-10-03 00:00:00 -0000
categories: tidyverse, rstats
---

When I first started learning R a few years ago, I focused on picking up the fundamentals of Base R, as well as the [Tidyverse](https://tidyverse.org/) set of packages, concurrently. Early on, I made a point of writing as much of my code within the Tidyverse framework as possible, favoring the readability and supportive online community.

More recently, I’ve realized that I haven’t kept up with many of the enhancements that the Tidyverse and RStudio team have released. The two types of functionality I’d like to catch up on via this post are `tidyselect` and dplyr’s `across()`.

### Tidyselect

Tidy selection refers to the the tidy evaluation method of choosing variables, and is used in functions like `select()`, `rename()`, `pull()`, and `across()`. There’s a great primer on *tidy evaluation* in the [vignette("programming")](https://dplyr.tidyverse.org/articles/programming.html).

Many functions that use tidy selection will include a <tidy-select> parameter, which means that inputs must be provided in the **tidyselect specification**.

Using the `dplyr`’s [tidy-select reference](https://dplyr.tidyverse.org/reference/dplyr_tidy_select.html), I’ll test some of this functionality on dplyr’s built-in *storms* dataset.

**The Storms Dataset**  
Sample of 5 rows:

| name  | year | month | day | hour | lat  | long  | status             | category | wind | pressure | ts_diameter | hu_diameter |
|-------|------|-------|-----|------|------|-------|--------------------|----------|------|----------|-------------|-------------|
| Emily | 1993 | 8     | 30  | 12   | 31.8 | -71.4 | hurricane          | 1        | 75   | 975      | NA          | NA          |
| Katia | 2011 | 9     | 9   | 12   | 38.5 | -67.1 | hurricane          | 1        | 75   | 961      | 437.2964    | 120.8319    |
| Debby | 2006 | 8     | 24  | 0    | 18.4 | -33.9 | tropical storm     | 0        | 45   | 1000     | 80.5546     | 0.0000      |
| Maria | 2011 | 9     | 8   | 18   | 13.2 | -52.1 | tropical storm     | 0        | 40   | 1004     | 155.3553    | 0.0000      |
| Danny | 1991 | 9     | 7   | 0    | 10.4 | -25.8 | tropical depression | -1      | 25   | 1010     | NA          | NA          |


#### Selection Helpers  

### everything()

Select all variables.

```
storm_sample %>% 
  select(everything()) 
```  

| name  | year | month | day | hour | lat  | long  | status              | category | wind | pressure | ts_diameter | hu_diameter |
|-------|------|-------|-----|------|------|-------|---------------------|----------|------|----------|-------------|-------------|
| Emily | 1993 | 8     | 30  | 12   | 31.8 | -71.4 | hurricane           | 1        | 75   | 975      | NA          | NA          |
| Katia | 2011 | 9     | 9   | 12   | 38.5 | -67.1 | hurricane           | 1        | 75   | 961      | 437.2964    | 120.8319    |
| Debby | 2006 | 8     | 24  | 0    | 18.4 | -33.9 | tropical storm      | 0        | 45   | 1000     | 80.5546     | 0.0000      |
| Maria | 2011 | 9     | 8   | 18   | 13.2 | -52.1 | tropical storm      | 0        | 40   | 1004     | 155.3553    | 0.0000      |
| Danny | 1991 | 9     | 7   | 0    | 10.4 | -25.8 | tropical depression | -1       | 25   | 1010     | NA          | NA          |

### last_col()  

Select variable that matches the last column.

```
storm_sample %>% 
  select(last_col())
```  


| hu_diameter |
|-------------|
| NA          |
| 120.8319    |
| 0.0000      |
| 0.0000      |
| NA          |
  

### Using `last_col()`, with an offset  

Select the last column, with an offset by position (i.e., the three positions from last column – the fourth from last).

```
storm_sample %>% 
  select(last_col(offset = 3))
```

| wind |
|------|
| 75   |
| 75   |
| 45   |
| 40   |
| 25   |


## Selection with Pattern Matching  

#### starts_with()

Select variables that start with a given prefix.  

```
storm_sample %>% 
  select(starts_with("l"))
```  

| lat  | long  |
|------|-------|
| 31.8 | -71.4 |
| 38.5 | -67.1 |
| 18.4 | -33.9 |
| 13.2 | -52.1 |
| 10.4 | -25.8 |


#### ends_with()

Select variables that end with a given suffix.  

```
storm_sample %>% 
  select(ends_with("r"))
```

| year | hour | ts_diameter | hu_diameter |
|------|------|-------------|--------------|
| 1993 | 12   | NA          | NA           |
| 2011 | 12   | 437.2964    | 120.8319     |
| 2006 | 0    | 80.5546     | 0.0000       |
| 2011 | 18   | 155.3553    | 0.0000       |
| 1991 | 0    | NA          | NA           |


#### contains()  
Select varibles that contain a literal string.  

```
storm_sample %>% 
  select(contains("sure"))
```

| pressure |
|----------|
| 975      |
| 961      |
| 1000     |
| 1004     |
| 1010     |

#### matches()  

Select variables that match a regular expression.  

```
storm_sample %>% 
  select(matches("[aeiou]"))
```  

| name  | year | month | day | hour | lat  | long  | status              | category          | wind | pressure | ts_diameter | hu_diameter |
|-------|------|-------|-----|------|------|-------|---------------------|-------------------|------|----------|-------------|-------------|
| Emily | 1993 | 8     | 30  | 12   | 31.8 | -71.4 | hurricane           | 1                 | 75   | 975      | NA          | NA          |
| Katia | 2011 | 9     | 9   | 12   | 38.5 | -67.1 | hurricane           | 1                 | 75   | 961      | 437.2964    | 120.8319    |
| Debby | 2006 | 8     | 24  | 0    | 18.4 | -33.9 | tropical storm      | 0                 | 45   | 1000     | 80.5546     | 0.0000      |
| Maria | 2011 | 9     | 8   | 18   | 13.2 | -52.1 | tropical storm      | 0                 | 40   | 1004     | 155.3553    | 0.0000      |
| Danny | 1991 | 9     | 7   | 0    | 10.4 | -25.8 | tropical depression | -1                | 25   | 1010     | NA          | NA          |


#### num_range()  
Select variables that match a numerical range, like x01, x02, x03.  

```
storm_sample %>% 
  mutate("some_string1" = 1,
         "some_string2" = 0) %>% 
  select(num_range(prefix = "some_string",
                   range = 1:5))
```

| some_string1 | some_string2 |
|--------------|--------------|
| 1            | 0            |
| 1            | 0            |
| 1            | 0            |
| 1            | 0            |
| 1            | 0            |

### Selection using character vectors  

#### all_of()  

Matches variable names in a character vector. All names must be present, otherwise an out-of-bounds error is thrown.

```
# Assign a vector of arbitrary variables to vrbls
vrbls <- c("year","wind","status")

storm_sample %>% 
  select(all_of(vrbls))
```

| year | wind | status             |
|------|------|--------------------|
| 1993 | 75   | hurricane          |
| 2011 | 75   | hurricane          |
| 2006 | 45   | tropical storm     |
| 2011 | 40   | tropical storm     |
| 1991 | 25   | tropical depression|


#### any_of()  
Same as all_of(), except that no error is thrown for names that don’t exist.  

```
# Add a variable outside the scope of the dataset
vrbls2 <- c(vrbls, "dog")

storm_sample %>% 
  select(any_of(vrbls2))
```  

| year | wind | status             |
|------|------|--------------------|
| 1993 | 75   | hurricane          |
| 2011 | 75   | hurricane          |
| 2006 | 45   | tropical storm     |
| 2011 | 40   | tropical storm     |
| 1991 | 25   | tropical depression|

## Selection of variables within a function  

#### where()

Applies a function to all variables and selects those for which the function returns TRUE.  

Common use case: selecting columns of a specific data type

```
storm_sample %>% 
  select(where(is.factor))
```

| category |
|----------|
| 1        |
| 1        |
| 0        |
| 0        |
| -1       |


## Embracing (i.e., \{\{ var \}\})  

Using **\{\{ double curly brace \}\}** syntax ([pronounced ‘curly curly’](https://www.tidyverse.org/blog/2019/06/rlang-0-4-0/#a-simpler-interpolation-pattern-with)) allows users to provide a variable that can be passed into a function that uses data masking or tidy selection. This helps make functions much more extensible to many types of inputs.

<script src="https://gist.github.com/segoldma/c5821241398b3e1f459ef92a8a9037a2.js"></script>

| name    | year | month | day | hour | lat  | long  | status             | category          | wind | pressure | ts_diameter | hu_diameter |
|---------|------|-------|-----|------|------|-------|--------------------|-------------------|------|----------|-------------|-------------|
| Georges | 1980 | 9     | 1   | 18   | 16.8 | -42.1 | tropical depression| -1                | 30   | 1010     | NA          | NA          |
| Iris    | 1995 | 8     | 30  | 6    | 23.8 | -61.8 | hurricane          | 1                 | 70   | 977      | NA          | NA          |
| Emily   | 1987 | 9     | 24  | 18   | 26.0 | -72.0 | tropical storm     | 0                 | 45   | 1002     | NA          | NA          |

### Across  
According to the [dplyr documentation](https://dplyr.tidyverse.org/reference/across.html), `across()` provides an easy interface to apply the same transformation to multiple columns.

#### Apply a calculation function to multiple columns  
Calculating the mean of all Integer columns, grouping by the Storm’s category:  

| category | day      | wind     | pressure  |
|----------|----------|----------|-----------|
| -1       | 15.95953 | 27.26916 | 1007.6259 |
| 0        | 15.71553 | 45.80037 | 999.3291  |
| 1        | 16.22433 | 70.91098 | 981.5181  |
| 2        | 16.23089 | 89.43471 | 967.4729  |
| 3        | 15.55647 | 104.64187| 953.5289  |
| 4        | 14.39655 | 121.55172| 939.5345  |
| 5        | 18.00000 | 145.07353| 916.4265  |

#### Transform all columns of a certain datatype to another datatype 
Coercing all **factor** columns to **string** datatypes:  

<script src="https://gist.github.com/segoldma/3573c4d78ae7e526559385c5fd2af0ae.js"></script>


#### Running multiple named functions on multiple columns:  

Calculating the minimum, maximum, standard deviation, and mean of columns that start with the letter “L.” 

```
storms %>% 
  group_by(category) %>% 
  summarize(across(starts_with("l"), list(min_val = min,
                                         max_val = max,
                                         std_dev = sd,
                                         avg = mean)))
```  

| category | lat_min_val | lat_max_val | lat_std_dev | lat_avg | long_min_val | long_max_val | long_std_dev | long_avg   |
|----------|-------------|-------------|-------------|---------|--------------|--------------|--------------|------------|
| -1       | 7.2         | 46.5        | 8.186093    | 22.59057| -109.3       | -6.0         | 22.91269     | -66.72035  |
| 0        | 8.9         | 51.9        | 8.684703    | 24.79042| -102.6       | -12.8        | 19.33437     | -63.21717  |
| 1        | 9.5         | 50.8        | 8.647063    | 28.31751| -99.2        | -18.5        | 17.02850     | -61.39223  |
| 2        | 9.8         | 45.3        | 7.687820    | 26.94252| -97.8        | -30.6        | 16.85885     | -63.10127  |
| 3        | 10.2        | 43.5        | 6.377100    | 24.27906| -97.8        | -31.4        | 14.48734     | -67.95785  |
| 4        | 10.6        | 38.8        | 4.483112    | 20.50259| -98.0        | -32.2        | 13.38570     | -67.89425  |
| 5        | 13.7        | 27.2        | 3.822346    | 19.73382| -97.1        | -54.6        | 10.35117     | -78.14559  |


#### Row-wise calculations with **c_across()**  
Though uncommon, there may be instances where we need to do calculations on a row-by-row basis. `dplyr` provides a variation of `across()` to accomplish this: `c_across()`.

Starting with a simple transform of the `storms` dataset, where each row will be a year, each column will be the category of storm, and each value represents the average wind speed for the corresponding year and category. The transformed dataset will be called `windy_years`.

For the sake of example, calculate a somewhat meaningless row-wise mean on each row of this table – assigning the value to `avg`.

```
windy_years %>% 
  sample_n(10) %>% # sample 10 rows
  rowwise() %>% 
  mutate("avg" = mean(
              c_across(everything()),
              na.rm = TRUE)
         ) %>% 
  kableExtra::kbl() %>% 
  kable_paper("hover", full_width = F)
```  


| year | -1       | 0        | 1        | 2        | 3        | 4        | 5        | avg      |
|------|----------|----------|----------|----------|----------|----------|----------|----------|
| 1997 | 25.93023 | 43.28571 | 68.75000 | 92.50000 | 106.6667 | NA       | NA       | 389.0221 |
| 1994 | 24.86111 | 43.89535 | 68.33333 | NA       | NA       | NA       | NA       | 532.7724 |
| 1979 | 25.03788 | 45.12048 | 70.90000 | 87.30769 | 103.3333 | 122.3077 | 145.7143 | 322.3402 |
| 1977 | 25.93750 | 45.00000 | 70.35714 | 87.50000 | 110.0000 | 120.0000 | 145.0000 | 322.5993 |
| 1981 | 25.86957 | 45.96154 | 71.62162 | 89.11765 | 103.1250 | 115.0000 | NA       | 347.3851 |
| 2012 | 28.12500 | 48.33333 | 70.41667 | 89.56522 | 100.0000 | NA       | NA       | 391.4067 |
| 1992 | 27.85714 | 46.32353 | 71.47059 | 89.60000 | 105.0000 | 122.0833 | 145.0000 | 324.9168 |
| 2001 | 27.17593 | 47.43671 | 71.81159 | 89.68750 | 103.8889 | 119.0000 | NA       | 351.4287 |
| 1993 | 28.39623 | 45.27778 | 70.76923 | 89.00000 | 100.0000 | NA       | NA       | 387.7405 |
| 1990 | 27.56637 | 45.51020 | 69.13333 | 89.00000 | 101.2500 | NA       | NA       | 387.0767 |

## Wrapping up  

Though I expect to benefit from all of these enhancements, I think tidy selection will have the most immediate impact. Many of my analysis workflows involve transforming large datasets with many columns into easier-to-work-with tables with the columns that are relevant to my analysis. Tidy selection makes it possible to do this with limited hard-coding. I also expect to use across() in place of repetitive code where I calculate measures on multiple columns. Finally, I think I’ll be able to make many of my analysis scripts more concise, combining many existing functions into fewer generalized functions – all thanks to my new friend `\{\{ curly curly \}\}` syntax.  

























