export function formatFloatingValue(num: number) {
  const numStr = num.toString();

  if (numStr.includes(".")) {
    const [, fractionalPart] = numStr.split(".");

    if (fractionalPart.length > 2) {
      return parseFloat(num.toFixed(2));
    } else if (fractionalPart.length === 2 && fractionalPart === "00") {
      return num;
    }
  }

  return num;
}
