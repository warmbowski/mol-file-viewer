export function getDateTimeStamp(date = new Date()) {
  return date.toISOString().slice(0, 16).replace("T", "_").replace(":", "");
}
