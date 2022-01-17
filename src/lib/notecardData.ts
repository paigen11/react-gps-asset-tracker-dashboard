export async function fetchNotecardData(startDate?: number) {
  interface dataProps {
    [file: string]: any;
  }

  let eventArray: object[] = [];
  const baseUrl = `https://api.notefile.net/v1/projects/${process.env.NOTEHUB_PROJECT_ID}/events`;
  let queryParamStartDate = "?startDate=";
  let fullUrl: string = "";
  if (startDate) {
    fullUrl = baseUrl + queryParamStartDate + startDate;
  } else {
    fullUrl = baseUrl;
  }

  const headers = {
    "Content-Type": "application/json",
    "X-SESSION-TOKEN": `${process.env.NOTEHUB_TOKEN}`,
  };

  const res = await fetch(fullUrl, {
    headers: headers,
  });
  const eventData = await res.json();
  eventArray = eventData.events;

  while (eventData.has_more) {
    const res = await fetch(`${baseUrl}?since=${eventData.through}`, {
      headers: headers,
    });
    const newEventData = await res.json();
    eventArray = [...eventArray, ...newEventData.events];
    if (newEventData.has_more) {
      eventData.through = newEventData.through;
    } else {
      eventData.has_more = false;
    }
  }

  const filteredEvents = eventArray.filter(
    (event: dataProps) => event.file === "_track.qo"
  );

  return filteredEvents;
}
