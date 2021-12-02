import useSWR from "swr";

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  const { data } = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
};

// todo remove - not currently being used
export const useNotecardData = () => {
  const { data, error } = useSWR("/api/getEvents", fetcher, {
    refreshInterval: 5000,
  });

  let filteredEvents: object[] = [];
  if (data && data.events && data.events.length > 0) {
    filteredEvents = data.events.filter(
      (event: { file: string; gps_location: object }) =>
        event.file === "_track.qo"
    );
    return { data: filteredEvents, error };
  }
  return { data, error };
};
