export const generatePlaceholder = (text: string, width: number = 600, height: number = 200): string => {
    return `https://placehold.co/${width}x${height}?text=${text}`
}