export default function timeToString(dateString) {
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let currTime = new Date();
    let seconds = Math.floor((currTime - date) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    if (minutes === 0) {
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }
    if (hours === 0) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    if (days < 365) {
        return `${months[date.getMonth()]} ${date.getDate()} at ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}
