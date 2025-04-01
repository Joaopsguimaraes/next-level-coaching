export const applyZipCodeMask = (value?: string) => {
  if (!value) return value;

  value = value.replace(/\D/g, "");

  if (value.length > 5) {
    value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  }

  if (value.length > 9) {
    value = value.substring(0, 9);
  }

  return value;
};
