export function mysql_datetime(date) {
  let currentDate = date ? new Date(date) : new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours();
  const minute = currentDate.getMinutes();
  const second = currentDate.getSeconds();
  const formattedDate = `${year}-${month}-${day} ${hours}:${minute}:${second}`;
  return formattedDate;
}
export function mysql_date(date) {
  let currentDate = date ? new Date(date) : new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
