layout: post
title: "Exploring Washington, D.C. Service Requests (2016)E"
date: 2017-10-27 00:00:00 -0000
categories: R

I’ve lived in Washington for about four years, but have lived in the D.C. metropolitan area my whole life. When looking for datasets to practice [ggplot2](http://ggplot2.org/) plotting, I came across [Open Data DC](http://opendata.dc.gov/), a catalog of datasets maintained by various city government agencies.

I gravitated toward the Newly Updated or Added section, hoping to find a data that I haven’t read much about before. I decided on Service Request Data (i.e., residents dialing 311), thinking that picking something more boring than crime or household income meant I wouldn’t need to worry about stacking up against the constant stream great work on topics like [wealth](http://storymaps.esri.com/stories/2016/wealth-divides/index.html) and [income inequality](https://districtmeasured.com/2015/06/23/ceo-pay-is-not-the-only-factor-that-accounts-for-income-inequality-in-dc-increasingly-the-corporate-ladder-youre-on-matters-more-than-where-you-are-on-the-corporate-ladder/) and [gentrification](https://www.datalensdc.com/gentrification-by-numbers.html) in the District.

This isn’t so much an analysis as it is practice on cleaning and transforming data in preparation for a few basic plots. I’ve included my code and plots below. I hope that by adding written explanations and reoganizing my code, I’ll reap some of the learning and retention benefits of re-writing notes after a lecture (although supposedly [doing so on a computer](http://www.npr.org/2016/04/17/474525392/attention-students-put-your-laptops-away) is less effective).

### Getting and Preparing the Data
*Data retrieved from DC Data Catalog (http://data.dc.gov/)*

I got started by downloading the 2016 Service Request Data as a .csv, and loading it into RStudio, alongside the dplyr, ggplot2, and scales packages.

```
## Analyzing Washington, D.C. Service Requests from 2016
## (source: http://opendata.dc.gov/datasets/city-service-requests-in-2016)

## Load Packages
library(dplyr)
library(ggplot2)
library(scales)

### Read in DC Service Requests Data - 2016 ###
city_service_reqs_2016 <- read.csv("City_Service_Requests_in_2016.csv")
```

After loading the raw data, I reformatted the column headers by converting to lowercase, and renaming the variables with underscores to make my code easier to read and write.

```
### Call 311 to Clean Up Column Headers
lower_headers <- tolower(colnames(city_service_reqs_2016))
colnames(city_service_reqs_2016) <- lower_headers
rm(lower_headers)

### Select Subset of Columns - named "requests_2016"
requests_2016 <- city_service_reqs_2016 %>%
  select("service_code" = servicecode,
         "service_code_description" = servicecodedescription,
         "service_type_code_description"  = servicetypecodedescription,
         "organization" = organizationacronym,
         "service_call_count" = servicecallcount,
         "add_date" = adddate,
         "resolution_date" = resolutiondate,
         "service_due_date" = serviceduedate,
         "service_order_date" = serviceorderdate,
         "inspection_flag" = inspectionflag,
         "inspection_date" = inspectiondate,
         "service_order_status" = serviceorderstatus,
         "status_code" = status_code,
         "priority" = priority,
         "street_address" = streetaddress,
         "latitude" = latitude,
         "longitude" = longitude,
         "zipcode" = zipcode,
         "ward" = ward)
```

Next, I converted the dataframe into a tibble, because I think the print formatting looks nicer. I also coerced five of the variables to dates in the YYYY/MM/DD format.

```
requests_2016 <- requests_2016 %>% as_tibble() 

### Format Dates as such
requests_2016$add_date <- strtrim(requests_2016$add_date ,10) %>% as.Date("%Y-%m-%d")
requests_2016$resolution_date <- strtrim(requests_2016$resolution_date, 10) %>% as.Date("%Y-%m-%d")
requests_2016$service_due_date <- strtrim(requests_2016$service_due_date, 10) %>% as.Date("%Y-%m-%d")
requests_2016$service_order_date <- strtrim(requests_2016$service_order_date, 10) %>% as.Date("%Y-%m-%d")
requests_2016$inspection_date <- strtrim(requests_2016$inspection_date, 10) %>% as.Date("%Y-%m-%d")
```

**Checking out the structure**

```
## Classes 'tbl_df', 'tbl' and 'data.frame':    302985 obs. of  19 variables:
##  $ service_code                 : Factor w/ 132 levels "11","BICYCLE",..: 41 82 95 62 72 72 81 104 104 104 ...
##  $ service_code_description     : Factor w/ 147 levels "311Force Reported Issues",..: 55 82 109 140 11 11 81 137 137 137 ...
##  $ service_type_code_description: Factor w/ 29 levels "311- Call Center",..: 16 26 24 29 20 20 16 20 20 20 ...
##  $ organization                 : Factor w/ 12 levels "DC-ICH","DDOT",..: 7 2 2 2 7 7 7 7 7 7 ...
##  $ service_call_count           : int  1 1 1 1 1 1 1 1 1 1 ...
##  $ add_date                     : Date, format: "2016-01-04" "2016-05-02" ...
##  $ resolution_date              : Date, format: "2016-01-04" "2016-05-03" ...
##  $ service_due_date             : Date, format: "2016-01-05" "2016-05-09" ...
##  $ service_order_date           : Date, format: "2016-01-04" "2016-05-02" ...
##  $ inspection_flag              : Factor w/ 2 levels "N","Y": 1 1 1 1 1 1 1 1 1 1 ...
##  $ inspection_date              : Date, format: NA NA ...
##  $ service_order_status         : Factor w/ 10 levels "CLOSE","CLOSED",..: 2 2 7 2 2 2 2 2 2 2 ...
##  $ status_code                  : Factor w/ 2 levels "CLOSED","OPEN": 1 1 2 1 1 1 1 1 1 1 ...
##  $ priority                     : Factor w/ 4 levels "","EMERGENCY",..: 3 3 3 3 3 3 3 3 3 3 ...
##  $ street_address               : Factor w/ 89514 levels "","1","1 - 10 BLOCK OF GALLATIN STREET NE",..: 50930 5100 56981 6441 12019 12019 25959 68600 68600 85608 ...
##  $ latitude                     : num  39 38.9 38.9 38.9 38.8 ...
##  $ longitude                    : num  -77.1 -77 -77 -77 -77 ...
##  $ zipcode                      : int  20015 20005 20011 20001 20032 20032 20001 20001 20001 20001 ...
##  $ ward                         : Factor w/ 10 levels "","1","2","3",..: 4 3 5 7 9 9 7 2 2 6 ...
```

### Making a few Plots
**Presumably, DC residents call 311 for a variety of reasons, submitting requests with a variety of agencies. The first plot examines the number of requests filed within each organization.**

As we can see, the Department of Public Works (DPW), District Department of Transportation (DDOT), Department of Motor Vehicles (DMV), and the city’s volunteerism office (Serve DC) received most of the requests in 2016.

![Alt text](docs/assets/images/dc-service-reqs-reqs-by-org.png)

```
requests_2016 %>%
  group_by(organization) %>%
  tally() %>%
  ggplot(aes(x = reorder(organization, n), y = n)) +
  geom_point() +
  coord_flip() +
  theme_bw() + 
  theme(axis.text.x = element_text(hjust = 1),
        panel.grid.major.x = element_blank(),
        panel.grid.minor.x = element_blank(),
        panel.grid.major.y = element_line(color = "grey60", linetype = "dashed")) +
  geom_text(aes(label = n), vjust = 1.4, hjust = .8) +
  ylab("Number of Cases") +
  xlab("Organization") + 
  ggtitle("2016 Washington DC Service Requests by Organization",subtitle = "via DC's 311 Service Request Center")
  ```

**Next, I examined the number of requests filed within each of DC’s 8 Wards.**
![Alt text](docs/assets/images/dc-service-reqs-reqs-by-ward.png)

```
requests_2016 %>%
  filter(ward %in% c("1","2","3","4","5","6","7","8")) %>% 
  group_by(ward) %>%
  tally() %>%
  ggplot(aes(x = ward, y = n)) +
  geom_bar(stat = "identity") +
  theme_bw() +
  theme(axis.text.x = element_text(hjust = 1),
        panel.grid.major.x = element_blank(),
        panel.grid.minor.x = element_blank(),
        panel.grid.major.y = element_line(color = "grey60", linetype = "dashed")) +
  geom_text(aes(label = n), color = "white", vjust = 2, hjust = 1, angle=45) +
  ylab("Number of Cases") +
  xlab("Ward") + 
  ggtitle("2016 Washington DC Service Requests by Ward",subtitle = "via DC's 311 Service Request Center")
  ```

**Combining the previous two segments, I plotted the number of service requests by organization, within in each Ward.**

The plot below displays the absolute number of requests, while the plot below it shows requests relative to each Ward’s total.

![](docs/assets/images/dc-service-reqs-reqs-by-ward-and-org-abs.png)

![](docs/assets/images/dc-service-reqs-reqs-by-ward-and-org-rel.png)

**Noticing that there was an organization related to snow, I wanted to examine the seasonality of service requests, if any.**

![Alt text](docs/assets/images/dc-service-reqs-reqs-by-day.png)

```
  requests_2016 %>%
    ggplot(aes(x = add_date)) +
    geom_bar() +
    scale_x_date(labels = date_format("%B")) +
    ylab("Number of Cases") +
    xlab("") +
    ggtitle("2016 Washington DC Service Requests", subtitle = "Calendar Year")
```

There seems to have been a huge spike in service requests in the January/February range.

*What were the top-15 request days?*

```
requests_2016 %>%
    group_by(add_date) %>%
    tally() %>%
    arrange(desc(n)) %>%
    top_n(15)
## Selecting by n
## # A tibble: 15 x 2
##      add_date     n
##        <date> <int>
##  1 2016-01-25  3883
##  2 2016-01-24  3199
##  3 2016-01-21  2714
##  4 2016-01-20  2404
##  5 2016-01-26  2333
##  6 2016-01-22  2243
##  7 2016-01-23  2056
##  8 2016-08-29  1708
##  9 2016-07-21  1468
## 10 2016-08-31  1410
## 11 2016-07-26  1351
## 12 2016-07-20  1340
## 13 2016-08-23  1283
## 14 2016-08-30  1279
## 15 2016-08-09  1265
```

So, the top seven request days were consecutive from January 20-27. I didn’t dig into the spike any further, but I’d venture to guess that this was the week of the Presidental Inauguration. In the future, it would be interesting to explore the types of requests during the 2016 Inauguration week, and compare the 2016 data against the 2012 Inauguration.