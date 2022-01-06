# React Notehub Asset Tracking Dashboard

This is an asset tracking dashboard to display the information captured from Blues Wireless Notecards in vehicles.

https://user-images.githubusercontent.com/20400845/145855414-88b1a46c-8ee4-40ab-bac1-dd783abd6d15.mp4

## Project Basics

The Asset Tracking dashboard is a Next.js app which serves up a pre-configured dashboard complete with Leaflet.js map and Mapbox overlay to plot Notecard coordinates as they're relayed to Notehub, Recharts charts displaying Notecard's current voltage and temperature, and a react-table event list so a user can see the frequency with which tracking events are being recorded.

The Notecard records its current GPS location once every 10 minutes while the vehicle is in motion.

It is preconfigured to poll for new events from the Notehub project every 2 minutes, and re-render the latest data on the dashboard.

## Learn More

- [Next.js Docs](https://nextjs.org/learn/basics/create-nextjs-app) - Introduction to Next.js
- [Notecard Asset Tracking Docs](https://dev.blues.io/notecard/notecard-guides/asset-tracking/) - Configuring a Blues Wireless notecard to do asset tracking
- [Recharts Docs](https://recharts.org/en-US/) - Introduction to Recharts composable chart library
- [React Leaflet Docs](https://react-leaflet.js.org/docs/start-introduction/) - React Leaflet library introduction
- [React Table Docs](https://react-table.tanstack.com/docs/overview) - React Table getting started and example documentation
- [Mapbox Docs](https://docs.mapbox.com/help/getting-started/access-tokens/) - How to generate Mapbox access token and select view

## Getting Started

Below are steps from the Notecard all the way to the software to get your own instance of this dashboard up and running.

### Hardware Requirements

1. [Notecard](https://shop.blues.io/products/note-nbna-500) from Blues Wireless
2. [Notecarrier A with LiPo battery connector](https://shop.blues.io/products/carr-al) from Blues Wireless
3. [LiPo battery](https://www.adafruit.com/product/328)
4. (Optional) [MicroUSB to USB converter cable](https://www.amazon.com/AmazonBasics-Male-Micro-Cable-Black/dp/B071S5NTDR/) (or other cable to connect vehicle's power source to Notecarrier when vehicle is powered on)

### Notecard / Notehub Initial Setup

1. Create an account with Blues Wireless [Notehub site](https://notehub.io/) and make a new project that this Notecard will be associated with.
2. Follow the ["Quickstart Guide"](https://dev.blues.io/start/quickstart/notecarrier-al/) on the Blues Wireless developer site to get connect your Notecard, Notecarrier A and Notehub project.
3. Feed the following commands in, one at a time, to the Notecard while it's connected to your computer using the [webREPL](https://dev.blues.io/notecard-playground/) built in to the `dev.blues.io` site.

```bash
{"req":"card.restore","delete":true} # factory reset card
{"req":"hub.set","product":"com.blues.[PRODUCT_UID]","mode":"periodic","outbound":15,"inbound":15} # attach tracker to Notehub project, set it to periodic syncing outbound reqs every 15 mins and inbound reqs from Notehub every 15 mins
{"req":"card.motion.mode","sensitivity":2} # set card accelerometer to higher sensitivity level
{"req":"card.location.mode","mode":"periodic","seconds":360} # tell card how often to get GPS reading and only when motion is detected
{"req":"card.location.track","start":true,"heartbeat":true,"hours":12,"sync":true} # start tracking, issue heartbeat every 12 hours when no motion detected, sync data with Notehub as soon as a tracking event is acquired (this is an important one)
```

### Tracker Dashboard Project Configuration

1. Clone this repo locally.
2. Run `npm install` at the root of the project.
3. Generate an access token for Notehub via the following curl command. For further info see [this documentation](https://dev.blues.io/reference/notehub-api/api-introduction/#authentication)

```bash
  curl -X POST
    -L 'https://api.notefile.net/auth/login'
    -d '{"username":"[you@youremail.com]", "password": "[your_password]"}'
```

4. Create a `.env.local` file (also at the root of the project and give it the following variables with your Notehub credentials filled in)

```json
NOTEHUB_PROJECT_ID=APP_ID_GOES_HERE
NOTEHUB_TOKEN=NOTEHUB_GENERATED_TOKEN_GOES_HERE
MAPBOX_ACCESS_TOKEN=MAPBOX_ACCESS_TOKEN_GOES_HERE_IF_NOT_USING_MINE
```

5. Run `npm run dev` in the terminal to start the server
6. Visit http://localhost:8080 in your browser.
7. Watch the events begin to populate the new dashboard as the asset moves around.

![](https://user-images.githubusercontent.com/20400845/145859009-2efdd436-7b3f-4a87-bbee-ac970079cada.png)

## Considerations

If you do intend to use this as a potential vehicle tracker, keep the following things in mind:

- **Hide the Notecard** - Hide the Notecard somewhere in the vehicle where it's not easily discoverable. The Notecard AL is equipped with an Ignion antenna, which is quite powerful, therefore, it's very possible that without a direct line of sight to the sky - say, inside the center console of a car, and it will still be able to get a triangulation lock for GPS purposes. Test this out by placing the Notecard where you might want to keep it stored and check if its location registers. Also, avoid putting it somewhere where it would either be exposed to extreme heat (like in the dashboard near the engine and windshield) or wet (like in the bumper of the car)

![Notecard hidden in vehicle's center console](https://user-images.githubusercontent.com/20400845/145850469-5079878e-645d-4e98-a22e-6f25788e88d4.JPG)

- **Have multiple power supplies** - In addition to a LiPo battery to power the Notecard when the vehicle is off, invest in some way to power the Notecard from the vehicle's power source when it's on. Although the Notecard is designed to be low power, it is still relatively power intensive to get a GPS coordinate lock and then send that data to Notehub. When SOS Mode is enabled, especially, this could be an issue. Nowadays, most vehicles come equipped with USB ports or adapters to plug in electronics, so wherever the Notecard is hidden, invest in a micro-USB to car connector so that when the car is powered on, the Notecard can run off of the car battery and charge its LiPo battery, which it will run off of when the vehicle is off.

![Notecard connected to car power source via USB cable](https://user-images.githubusercontent.com/20400845/145850653-768806ec-7173-413f-837f-d5ea1ebf30bc.JPG)

- **Invest in a cloud database to persist Notehub events** - Notehub charges users after a certain amount of events are sent out of the application per month (5,000, I believe), so it's not the most cost effective to poll all events from Notehub every 2 - 5 minutes. For a larger product, I'd recommend investing in some sort of a cloud database that could both pull all the initial data from Notehub and then possibly also receive events routed from Notehub as they are recorded there to cut down on costs. Then the app can pull data from that database as often as it likes with no fear of extraordinary bills being incurred from Notehub.

# Further Project Enhancements

This project accomplished what I originally set out to do, which was build a standalone dashboard that can connect to a Blues Wireless Notehub project, but in an internal hackathon at work, I took it one step further and made a similar dashboard that also has the capability of enabling high frequency tracking if, say, the vehicle being tracked is stolen (it happened to my parents while I was building this dashboard, in fact).

If you'd like to see the improvements in that dashboard, visit [this repo](https://github.com/paigen11/notelink-tracker-dashboard) for more info.

---
