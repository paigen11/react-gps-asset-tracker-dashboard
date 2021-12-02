export async function fetchNotecardData(startDate?: number) {
  let eventArray: object[] = [];
  const baseUrl = `https://api.notefile.net/v1/projects/${process.env.NOTEHUB_PROJECT_ID}/events`;
  let queryParamStartDate = "?startDate=";
  let fullUrl: string = "";
  if (startDate) {
    fullUrl = baseUrl + queryParamStartDate + startDate;
  } else {
    fullUrl = baseUrl;
  }

  const res = await fetch(fullUrl, {
    headers: {
      "Content-Type": "application/json",
      "X-SESSION-TOKEN": `${process.env.NOTEHUB_TOKEN}`,
    },
  });
  const eventData = await res.json();
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
  const filteredEvents = eventArray.filter(
    (event: { file: any }) => event.file === "_track.qo"
  );

  return filteredEvents;
}
