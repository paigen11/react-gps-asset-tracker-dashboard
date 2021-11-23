import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

type tempDataProps = {
  shortenedDate: string;
  date: string;
  temp: number;
}[];

const Chart = ({ tempData }: { tempData: tempDataProps }) => {
  // todo add scss file styling

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart
        width={500}
        height={400}
        data={tempData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="shortenedDate" label="Date" />
        <YAxis dataKey="temp" label="Temperature (F)" />
        <Tooltip content={<CustomTooltip payload={tempData} />} />
        <Area type="monotone" dataKey="temp" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
