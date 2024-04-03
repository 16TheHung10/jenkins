const NumberHelper = {
  roundedValue: (number, devider) => {
    const remainder = number % devider;
    if (remainder < devider / 2) return number - remainder;
    return number - remainder + devider;
  },
};
export default NumberHelper;
