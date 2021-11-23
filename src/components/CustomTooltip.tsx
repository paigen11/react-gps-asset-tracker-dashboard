const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{payload[0].payload.date}</p>
        <p>Temp: {payload[0].payload.temp}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
