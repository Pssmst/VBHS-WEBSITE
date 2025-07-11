import * as global from './global.js';
import * as data from './data.js';

for (const [src, pathway] of Object.entries(data.pathways)) {
    global.newElement(
        'a', 'pathwayContents', {
            id: `${src}-container`,
            classes: ['pathwayContainer'],
            href: `${src}.html`
        }
    );

    global.newElement(
        'h3', `${src}-container`, {
            text: pathway.metadata.name,
            id: `${src}-container`,
            classes: ['pathwayHeader'],
        }
    );

    global.newElement(
        'p', `${src}-container`, {
            text: pathway.metadata.longDescription,
            id: `${src}-container`,
            classes: ['pathwayHeader'],
            href: `${src}.html`
        }
    );
};