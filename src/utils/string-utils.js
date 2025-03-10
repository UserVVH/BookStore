const convertToSlug = (text) => {
  // Remove diacritics (accent marks) from Vietnamese characters
  const withoutDiacritics = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

  // Convert to lowercase and replace spaces/special chars with hyphens
  return withoutDiacritics
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
};

export default convertToSlug;
