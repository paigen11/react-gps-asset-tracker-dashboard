// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import dayjs from "dayjs";
import { fetchNotecardData } from "../src/lib/notecardData";
import TempChart from "../src/components/TempChart";
import VoltageChart from "../src/components/VoltageChart";
import { convertCelsiusToFahrenheit } from "../src/util/helpers";
import EventTable from "../src/components/EventTable";
import styles from "../styles/Home.module.scss";

type dataProps = {
  uid: string;
  device_uid: string;
  file: string;
  captured: string;
  received: string;
  body: {
    temperature: number;
    voltage: number;
    status: string;
  };
  tower_location?: {
    when: string;
    latitude: number;
    longitude: number;
  };
  gps_location: {
    latitude: number;
    longitude: number;
  };
};

export default function Home({ data }: { data: dataProps[] }) {
  // needed to make the Leaflet map render correctly
  const MapWithNoSSR = dynamic(() => import("../src/components/Map"), {
    ssr: false,
  });

  const [lngLatCoords, setLngLatCoords] = useState<number[][]>([]);
  const [lastPosition, setLastPosition] = useState<[number, number]>([
    33.82854810044288, -84.32526648205214,
  ]);
  const [latestTimestamp, setLatestTimestamp] = useState<string>("");
  const [latLngMarkerPositions, setLatLngMarkerPositions] = useState<
    [number, number][]
  >([]);
  const [tempData, setTempData] = useState<
    { date: string; shortenedDate: string; temp: number }[]
  >([]);

  const [voltageData, setVoltageData] = useState<
    { date: string; shortenedDate: string; voltage: number }[]
  >([]);
  const [eventTableData, setEventTableData] = useState<dataProps[]>([]);

  useEffect(() => {
    const lngLatArray: number[][] = [];
    const latLngArray: [number, number][] = [];
    const temperatureDataArray: {
      date: string;
      shortenedDate: string;
      temp: number;
    }[] = [];
    const voltageDataArray: {
      date: string;
      shortenedDate: string;
      voltage: number;
    }[] = [];
    if (data && data.length > 0) {
      const eventData = [...data].reverse();
      setEventTableData(eventData);
      data
        .sort((a, b) => {
          return Number(a.captured) - Number(b.captured);
        })
        .map((event) => {
          let lngLatCoords: number[] = [];
          let latLngCoords: [number, number] = [0, 1];
          const temperatureObj = {
            date: dayjs(event.captured).format("MMM D, YYYY h:mm A"),
            shortenedDate: dayjs(event.captured).format("MM/DD/YYYY"),
            temp: Number(convertCelsiusToFahrenheit(event.body.temperature)),
          };
          temperatureDataArray.push(temperatureObj);
          const voltageObj = {
            date: dayjs(event.captured).format("MMM D, YYYY h:mm A"),
            shortenedDate: dayjs(event.captured).format("MM/DD/YYYY"),
            voltage: Number(event.body.voltage.toFixed(2)),
          };
          voltageDataArray.push(voltageObj);
          if (event.gps_location !== null) {
            lngLatCoords = [
              event.gps_location?.longitude,
              event.gps_location?.latitude,
            ];
            latLngCoords = [
              event.gps_location?.latitude,
              event.gps_location?.longitude,
            ];
          } else if (event.tower_location) {
            lngLatCoords = [
              event.tower_location?.longitude,
              event.tower_location?.latitude,
            ];
            latLngCoords = [
              event.tower_location?.latitude,
              event.tower_location?.longitude,
            ];
          }
          lngLatArray.push(lngLatCoords);
          latLngArray.push(latLngCoords);
        });
      const lastEvent = data.at(-1);
      let lastCoords: [number, number] = [0, 1];
      if (lastEvent && lastEvent.gps_location !== null) {
        lastCoords = [
          lastEvent.gps_location.latitude,
          lastEvent.gps_location.longitude,
        ];
      } else if (lastEvent && lastEvent.tower_location) {
        lastCoords = [
          lastEvent.tower_location.latitude,
          lastEvent.tower_location.longitude,
        ];
      }
      setLastPosition(lastCoords);
      const timestamp = dayjs(lastEvent?.captured).format("MMM D, YYYY h:mm A");
      setLatestTimestamp(timestamp);
    }
    setLngLatCoords(lngLatArray);
    setLatLngMarkerPositions(latLngArray);
    setTempData(temperatureDataArray);
    setVoltageData(voltageDataArray);
  }, [data]);

  interface row {
    [row: { string }]: any;
  }

  const columns = useMemo(
    () => [
      {
        Header: "Latest Events",
        columns: [
          {
            Header: "Date",
            accessor: "captured",
            Cell: (props: { value: string }) => {
              const tidyDate = dayjs(props.value).format("MMM D, YY h:mm A");
              return <span>{tidyDate}</span>;
            },
          },
          {
            Header: "Voltage",
            accessor: "body.voltage",
            Cell: (props: { value: string }) => {
              const tidyVoltage = Number(props.value).toFixed(2);
              return <span>{tidyVoltage}V</span>;
            },
          },
          {
            Header: "Heartbeat",
            accessor: "body.status",
          },
          {
            Header: "GPS Location",
            accessor: "gps_location",
            Cell: (row) => {
              return (
                <span>
                  {row.row.original.gps_location.latitude.toFixed(6)}
                  &#176;,&nbsp;
                  {row.row.original.gps_location.longitude.toFixed(6)}&#176;
                </span>
              );
            },
          },
          {
            Header: "Cell Tower Location",
            accessor: "tower_location",
            Cell: (row) => {
              return (
                <span>
                  {row.row.original.tower_location.latitude.toFixed(3)}
                  &#176;,&nbsp;
                  {row.row.original.tower_location.longitude.toFixed(3)}&#176;
                </span>
              );
            },
          },
        ],
      },
    ],
    []
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>React Blues Wireless Asset Tracker</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Blues Wireless Asset Tracker Demo</h1>
        <div className={styles.grid}>
          <TempChart tempData={tempData} />
        </div>
        <div className={styles.map}>
          <MapWithNoSSR
            coords={lngLatCoords}
            lastPosition={lastPosition}
            markers={latLngMarkerPositions}
            latestTimestamp={latestTimestamp}
          />
        </div>
        <div className={styles.grid}>
          <VoltageChart voltageData={voltageData} />
        </div>
        <div className={styles.grid}>
          <EventTable columns={columns} data={eventTableData} />
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await fetchNotecardData();

  return { props: { data } };
};
