export default function getCookie(key: string) {
    const cookiesArray = document.cookie.split('; ');
    const targetName = key;
    
    for (const cookie of cookiesArray) {
        const [name, ...rest] = cookie.split('=');
        if (name === targetName) {
            return decodeURIComponent(rest.join('='));
        }
    }
    return null;
}