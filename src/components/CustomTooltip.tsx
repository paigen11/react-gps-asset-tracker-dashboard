import styles from "../../styles/CustomTooltip.module.scss";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <div className={styles.tooltipDetails}>
          <p className={styles.label}>Date: {payload[0].payload.date}</p>
          {payload[0].payload.temp ? (
            <p>Temp {payload[0].payload.temp}&#8457;</p>
          ) : (
            <p>Voltage {payload[0].payload.voltage}V</p>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
