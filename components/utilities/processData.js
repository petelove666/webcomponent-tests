export function processData(data) {
  console.log("Data: ", data);
  const processedData = data.map((item) => {
    for (const key in item) {
      if (
        item[key] &&
        typeof item[key] === "string" &&
        item[key].startsWith("http")
      ) {
        item[
          key
        ] = `<a href="${item[key]}" target="_blank" rel="noopener">${item[key]}</a>`;
      }
      if (
        Array.isArray(item[key]) &&
        item[key].every((v) => typeof v === "string" && v.startsWith("http"))
      ) {
        item[key] = item[key]
          .map((v) => `<a href="${v}" target="_blank" rel="noopener">${v}</a>`)
          .join(", ");
      }
    }
    return item;
  });

  console.log("Processed Data: ", processedData);

  return processedData;
}
