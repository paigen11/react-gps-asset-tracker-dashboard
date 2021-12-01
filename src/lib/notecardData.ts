export async function fetchNotecardData() {
  let eventArray: object[] = [];
  // todo make start date dynamic?

  const res = await fetch(
    // `https://api.notefile.net/v1/projects/${process.env.NOTEHUB_PROJECT_ID}/events?startDate=1636117939`,
    `https://api.notefile.net/v1/projects/${process.env.NOTEHUB_PROJECT_ID}/events?startDate=1637874000`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-SESSION-TOKEN": `${process.env.NOTEHUB_TOKEN}`,
      },
    }
  );
  const eventData = await res.json();
  console.log(eventData);
  while (eventData.has_more) {
    const res = await fetch(
      `https://api.notefile.net/v1/projects/${process.env.NOTEHUB_PROJECT_ID}/events?since=${eventData.through}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-SESSION-TOKEN": `${process.env.NOTEHUB_TOKEN}`,
        },
      }
    );
    const newEventData = await res.json();
    eventArray = [...eventArray, ...newEventData.events];
    if (newEventData.has_more) {
      eventData.through = newEventData.through;
    } else {
      eventData.has_more = false;
    }
  }
  // this is just for data up to the time of the theft
  const filteredEvents = eventArray.filter(
    (event: { file: string; captured: string }) =>
      event.file === "_track.qo" && event.captured < "2021-11-27T02:23:09Z"
  );
  /* todo use notehub api docs to fetch more events until `has_more` shows false
    use `through` to grab last unique id, pop it into the req url as `since` or just arbitrarily pull a big number with pageSize
    https://dev.blues.io/reference/notehub-api/event-api/ */

  // ray's notes
  // would assume that the algorithm would be:
  // Do an initial request to GetEventsByProject with a startDate indicating how far back you want to start
  // Go into a loop While (response.has_more) {
  //         do another request using "request.since = response.through"
  // }
  // console.log("count of filtered events", filteredEvents);
  return filteredEvents;
}
