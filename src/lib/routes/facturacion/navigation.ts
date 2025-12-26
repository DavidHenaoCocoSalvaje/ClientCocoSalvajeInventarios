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

export function getDefaultPath(root: string) {
    for (const section of sections) {
        const selectedItem = section.items.find((item) => item.selected);
        if (selectedItem) {
            return `${root}/${titleToPath(section.title)}/${titleToPath(selectedItem.title)}`;
        }
    }
    // Fallback si nada está seleccionado
    return `${root}/${titleToPath(sections[0].title)}/${titleToPath(sections[0].items[0].title)}`;
}
