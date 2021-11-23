export const convertCelsiusToFahrenheit = (celsiusTemp: number) => {
  const fahrenheitTemp = (celsiusTemp * 9) / 5 + 32;
  return fahrenheitTemp;
};
