export function timeToString(dateString) {
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

// for posts, answers, comments that have links
export const validateAndConvertHyperlinks = (text, setErrors, errorProperty) => {
    let isValid = true;
    let convertedText = text;
    let errors = {};

    let startIndex = 0;
    while (startIndex < convertedText.length) {
        const openBracketIndex = convertedText.indexOf('[', startIndex);
        const closeBracketIndex = convertedText.indexOf(']', openBracketIndex);
        const openParenIndex = convertedText.indexOf('(', closeBracketIndex);
        const closeParenIndex = convertedText.indexOf(')', openParenIndex);

        if (openBracketIndex !== -1 && closeBracketIndex !== -1 && openParenIndex !== -1 && closeParenIndex !== -1 &&
            closeBracketIndex === openParenIndex - 1) {
            const linkText = convertedText.substring(openBracketIndex + 1, closeBracketIndex);
            const linkUrl = convertedText.substring(openParenIndex + 1, closeParenIndex);

            if (linkText === '' || linkUrl === '' || (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://'))) {
                isValid = false;
                errors[errorProperty] = "Hyperlink format is empty or invalid";
                break;
            }

            const anchorTag = `<a href="${linkUrl}" target="_blank">${linkText}</a>`;
            convertedText = convertedText.substring(0, openBracketIndex) + anchorTag + convertedText.substring(closeParenIndex + 1);
            startIndex = openBracketIndex + anchorTag.length;
        } else {
            // No more hyperlinks to process
            break;
        }
    }

    if (!isValid) {
        setErrors(errors);
    }

    return { isValid, convertedText };
};