type TitleToPathParams = { title: string }
export function titleToPath({ title }: TitleToPathParams) {
    return title.replace(/\s+/g, '-').toLowerCase();
}
