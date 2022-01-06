import {
  XAxis,
  YAxis,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

type voltageDataChart = {
  shortenedDate: string;
  date: string;
  voltage: number;
}[];

const VoltageChart = ({ voltageData }: { voltageData: voltageDataChart }) => {
  return (
    <>
      <h2>Voltage Chart</h2>
      <ResponsiveContainer width={"100%"} height={300} min-width={300}>
        <LineChart
          data={voltageData}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="shortenedDate">
            <Label value="Date" position="bottom" />
          </XAxis>
          <YAxis dataKey="voltage" type="number" domain={[3.3, 5.6]}>
            <Label value="Voltage V" angle={-90} position="left" dy="-10" />
          </YAxis>
          <Tooltip content={<CustomTooltip payload={voltageData} />} />
          <Line type="monotone" dataKey="voltage" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default VoltageChart;
