import type { Section } from '$lib/models/aside';
import { titleToPath } from '$lib/utils/string';

export const sections: Array<Section> = [
    {
        title: 'Ventas',
        open: true,
        items: [
            {
                title: 'Explorador',
                selected: true
            }
        ]
    },
    {
        title: 'Compras',
        open: false,
        items: [
            {
                title: 'Explorador',
                selected: false
            }
        ]
    }
];

type GetDefaultPathParams = { root: string }
export function getDefaultPath({ root }: GetDefaultPathParams) {
    for (const section of sections) {
        const selectedItem = section.items.find((item) => item.selected);
        if (selectedItem) {
            return `${root}/${titleToPath({ title: section.title })}/${titleToPath({ title: selectedItem.title })}`;
        }
    }
    // Fallback si nada está seleccionado
    return `${root}/${titleToPath({ title: sections[0].title })}/${titleToPath({ title: sections[0].items[0].title })}`;
}

