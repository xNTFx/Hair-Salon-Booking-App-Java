export default function addTime(baseTime: string | undefined, timeToAdd: string) {
    if (!baseTime || !timeToAdd) {
      console.error("Invalid baseTime or timeToAdd");
      return "Invalid time";
    }
  
    const [baseHours, baseMinutes, baseSeconds = 0] = baseTime.split(":").map(Number);
    const [addHours, addMinutes, addSeconds = 0] = timeToAdd.split(":").map(Number);
  
    if (isNaN(baseHours) || isNaN(baseMinutes) || isNaN(baseSeconds) ||
        isNaN(addHours) || isNaN(addMinutes) || isNaN(addSeconds)) {
      console.error("Invalid time values detected");
      return "Invalid time";
    }
  
    const date = new Date();
    date.setHours(baseHours, baseMinutes, baseSeconds, 0);
  
    date.setHours(date.getHours() + addHours);
    date.setMinutes(date.getMinutes() + addMinutes);
    date.setSeconds(date.getSeconds() + addSeconds);
  
    const resultHours = String(date.getHours()).padStart(2, "0");
    const resultMinutes = String(date.getMinutes()).padStart(2, "0");
    const resultSeconds = String(date.getSeconds()).padStart(2, "0");
  
    return `${resultHours}:${resultMinutes}:${resultSeconds}`;
  }
  