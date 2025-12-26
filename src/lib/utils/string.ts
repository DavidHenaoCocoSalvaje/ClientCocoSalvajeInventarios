export function titleToPath(title: string) {
    return title.replace(/\s+/g, '-').toLowerCase();
}
