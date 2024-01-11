# tgbc

General Tough Guy Book Club demo find us page

## Demo page

Example find us page with chapter map and "Get closest chapter" button.

<https://monkfish-app-rp29l.ondigitalocean.app/www.toughguybookclub.com/find-us.html>

The demo site is just using Digital Ocean static website builder.

## Background

I have been looking at the TGBC Find Chapter website page and wished there was away to find the closest chapter. This seems to be a regular question in the pool hall.

So I decided to scratch my own itch and try to implement this feature.

A couple of constraints:

1. No usages costs. This removes using the [Google maps API](https://mapsplatform.google.com/pricing/), so I used [OpenStreetMaps](https://www.openstreetmaps.com).
2. No complicated framework, so I just used a Javascript library in the html page.

So this was implemented using:

1. Leftlet Javascript <https://leafletjs.com/>
2. OpenStreetMap tiles <https://www.openstreetmaps.com>
3. Embedding all the data in the webpage (it could be changed to use a database). The data is a simple array, so adding a new chapter takes 2mins.

Features:

1. Simple map that allows panning and zooming.
2. Click on a chapter to get the details in a popup.
3. Click the "Get closest chapter" button to request the goon's location and calculate the closest chapter.

## Added code

<https://github.com/adamleggo/tgbc/commit/3cf455b28c133e97eaaf505f4e59652ac0206a06>

1. In the header, import the Leftlet CSS and JS.
2. In the body, add a button, closest chapter id and map.
3. The javascript to populate the map and make the button work.

## Add a new chapter

Add a new element to the tgbcChapters array:

`
    {
        "state": "",
        "chapter": "",
        "location": "",
        "address": "",
        "latitude": ,
        "longitude": 
    },
`

Populate that details from the chapter address.

The latitude/longitude is located in the Google maps link after the @ symbol:

https://www.google.com.au/maps/place/King+O'Malley's/@**-35.2783555,149.131062**,15z/data=!4m5!3m4!1s0x0:0xc13bf352c0ad1916!8m2!3d-35.2783555!4d149.131062