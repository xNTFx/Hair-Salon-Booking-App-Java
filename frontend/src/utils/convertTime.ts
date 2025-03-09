export default function convertTime(timeString: string) {
  const [hours, minutes] = timeString.split(":").map(Number);
  let result = "";
  if (hours > 0) {
    result += `${hours}h `;
  }
  if (minutes > 0) {
    result += `${minutes}min`;
  }
  return result.trim();
}
