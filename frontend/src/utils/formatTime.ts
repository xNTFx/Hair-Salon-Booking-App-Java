export default function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");

  const formattedHours = parseInt(hours, 10).toString();

  return `${formattedHours}:${minutes}`;
}
