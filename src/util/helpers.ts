export const convertCelsiusToFahrenheit = (celsiusTemp: number) => {
  const fahrenheitTemp = ((celsiusTemp * 9) / 5 + 32).toFixed(1);
  return fahrenheitTemp;
};
