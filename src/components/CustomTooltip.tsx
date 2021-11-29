import styles from "../../styles/CustomTooltip.module.scss";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <div className={styles.tooltipDetails}>
          <p className={styles.label}>Date: {payload[0].payload.date}</p>
          <p>Temp: {payload[0].payload.temp}&#8457;</p>
        </div>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
