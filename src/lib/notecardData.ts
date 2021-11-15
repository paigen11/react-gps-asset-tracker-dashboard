export async function fetchNotecardData() {
  const res = await fetch(
    `https://api.notefile.net/v1/projects/${process.env.NOTEHUB_PROJECT_ID}/events?pageSize=200`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-SESSION-TOKEN": `${process.env.NOTEHUB_TOKEN}`,
      },
    }
  );
  const eventData = await res.json();
  // console.log(eventData.events.length);
  const filteredEvents = eventData.events.filter(
    (event: { file: string; gps_location: object }) =>
      event.file === "_track.qo"
  );
  /* todo use notehub api docs to fetch more events until `has_more` shows false
  use `through` to grab last unique id, pop it into the req url as `since` or just arbitrarily pull a big number with pageSize
    https://dev.blues.io/reference/notehub-api/event-api/ */
  return filteredEvents;
}
