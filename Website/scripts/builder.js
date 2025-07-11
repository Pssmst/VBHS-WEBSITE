import * as global from './global.js';
import { pathways } from './data.js';

function getGrade(year) {
    if (year === "freshman") return "9th Grade";
    if (year === "sophomore") return "10th Grade";
    if (year === "junior") return "11th Grade";
    if (year === "senior") return "12th Grade";
}

export function build(pathwayName) {
    const pathway = pathways[pathwayName];

    // SITE HEADER ////////////////////////////////////////
    
    global.newElement(
        'header', 'body', {
            id: "site-header",
        }
    );
    global.newElement(
        'nav', 'site-header', {
            id: "site-header-container",
            classes: ['container'],
        }
    );
    global.newElement(
        'a', 'site-header-container', {
            text: "VBHS Career Pathways",
            id: 'site-header-container-a',
            href: "index.html",
            classes: ['logo'],
        }
    );
    global.newElement(
        'ul', 'site-header-container', {
            id: 'nav-links',
        }
    );

    for (let item of [
        ['#overview', 'Overview'],
        ['#courses', 'Courses'],
        ['#extras', 'More Info'],
        ['#faq', 'FAQ'],
    ]) {
        const name = `nav-links-li-${item[0].substring(1)}`;
        global.newElement(
            'li', 'nav-links', {
                id: name,
            }
        );
        global.newElement(
            'a', name, {
                text: item[1],
                href: item[0],
            }
        );
    }

    ////// ACTUAL DETAILS /////////////////////////////////

    // HERO / INTRO

    global.newElement(
        'section', 'body', {
            id: "overview",
            classes: ['hero', 'container'],
        }
    );
    global.newElement(
        'h1', 'overview', {
            text: `${pathway.metadata.name} Pathway`,
        }
    );
    global.newElement(
        'p', 'overview', {
            text: pathway.metadata.shortDescription,
        }
    );

    // MAIN + SIDEBAR LAYOUT
    
    global.newElement(
        'div', 'body', {
            id: "layout-two-col",
            classes: ['container'],
        }
    );
    global.newElement(
        'main', 'layout-two-col', {
            id: "main",
        }
    );

    // Course Sequence

    global.newElement(
        'section', 'main', {
            id: "courses",
            classes: ['bigHeader'],
        }
    );
    global.newElement(
        'h2', 'courses', {
            text: "Course Sequence",
        }
    );
    global.newElement(
        'ul', 'courses', {
            id: 'timeline',
        }
    );

    for (const [year, courses] of Object.entries(pathway.courseSequence)) {
        const liID = `li-${year}`;
        const divID = `div-${year}`;

        global.newElement(
            'li', 'timeline', {
                id: liID,
            }
        );
        global.newElement(
            'time', liID, {
                text: getGrade(year),
            }
        );
        global.newElement(
            'div', liID, {
                id: divID,
                classes: ['course-card'],
            }
        );

        for (const course of courses) {
            global.newElement(
                'h3', divID, {
                    text: course.name,
                }
            );
            global.newElement(
                'p', divID, {
                    text: course.description,
                }
            );
        }
    }

    // Extras

    global.newElement(
        'section', 'main', {
            id: "extras",
            classes: ['bigHeader'],
        }
    );
    global.newElement(
        'h2', 'extras', {
            text: "Want Even More?",
        }
    );
    global.newElement(
        'div', 'extras', {
            id: 'grid',
        }
    );

    pathway.extras.forEach((extra, index) => {
        const cardID = `card-${index}`;
        
        global.newElement(
            'div', 'grid', {
                id: cardID,
                classes: ['card'],
            }
        );
        global.newElement(
            'h3', cardID, {
                text: extra.header,
            }
        );
        global.newElement(
            'p', cardID, {
                text: extra.description,
            }
        );

        if (extra.links != null) {
            for (const link of extra.links) {
                global.newElement(
                    'a', cardID, {
                        text: link.name,
                        href: link.href,
                        classes: ['link-button'],
                    }
                );
            }
        }
    });

    // FAQ

    global.newElement(
        'section', 'main', {
            id: "faq",
            classes: ['bigHeader'],
        }
    );
    global.newElement(
        'h2', 'faq', {
            text: "Frequently Asked Questions",
        }
    );
    global.newElement(
        'div', 'faq', {
            id: 'accordion',
        }
    );

    pathway.faq.forEach((accordion, index) => {
        const accordionID = `accordion-${index}`;
        
        global.newElement(
            'div', 'accordion', {
                id: accordionID,
                classes: ['accordion-item'],
            }
        );
        global.newElement(
            'button', accordionID, {
                text: accordion.question,
                classes: ['accordion-question'],
            }
        );
        global.newElement(
            'div', accordionID, {
                text: accordion.answer,
                classes: ['accordion-answer'],
            }
        );
    });

    document.querySelectorAll('.accordion-question').forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const isOpen = answer.classList.contains('visible');

            // Close all answers
            document.querySelectorAll('.accordion-answer.visible').forEach(openAns => openAns.classList.remove('visible'));

            // If it wasn't open, open it
            if (!isOpen) {
                answer.classList.add('visible');
            }
        });
    });

    // SIDEBAR

    global.newElement(
        'aside', 'layout-two-col', {
            id: "sidebar",
        }
    );

    pathway.sidebar.forEach((sidebar, index) => {
        const sidebarID = `sidebar-${index}`;
        
        global.newElement(
            'div', 'sidebar', {
                id: sidebarID,
                classes: ['sidebar-section', sidebar.type],
            }
        );
        global.newElement(
            'h3', sidebarID, {
                text: sidebar.header,
            }
        );

        if (sidebar.description != null) {
            global.newElement(
                'div', sidebarID, {
                    text: sidebar.description,
                }
            );
        }

        if (sidebar.embed != null) {
            global.newElement(
                'iframe', sidebarID, {
                    width: '100%',
                    height: '200px',
                    src: sidebar.embed,
                    frameborder: "0",
                    allowfullscreen: true,
                }
            );
        }

        if (sidebar.links != null) {
            for (const link of sidebar.links) {
                global.newElement(
                    'a', sidebarID, {
                        text: link.name,
                        href: link.href,
                        classes: ['link-button'],
                    }
                );
            }
        }
    });
}