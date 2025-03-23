export const applyPhoneMask = (value?: string) => {
  if (!value) return value;

  const numbers = value.replace(/\D/g, "");
  let masked = "";

  if (numbers.length > 0) {
    masked += "(" + numbers.substring(0, 2);
    if (numbers.length > 2) {
      masked += ") ";
      const remaining = numbers.substring(2);

      masked += remaining.substring(0, 5);
      if (remaining.length > 5) {
        masked += "-" + remaining.substring(5, 9);
      }
    } else {
      masked += ")";
    }
  }
  return masked;
};
