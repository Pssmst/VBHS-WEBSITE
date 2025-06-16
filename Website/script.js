const pathways = [
    {
        name: "Biomedical Science",
        description: "Description 1",
        srcName: "biomedical"
    },
    {
        name: "Computer Science",
        description: "Description 2",
        srcName: "computer-science"
    },
    {
        name: "Engineering",
        description: "Description 3",
        srcName: "engineering",
        classes: [
            "Intro to Engineering",
            "Engineering I",
            "Engineering II",
            "Computer-Integrated Manufacturing (CIM)",
            "Engineering Design & Development (EDD)",
        ]
    },
    {
        name: "Automation Technology",
        description: "Description 4",
        srcName: "automation-technology"
    },
    {
        name: "Business",
        description: "Description 5",
        srcName: "business"
    },
    {
        name: "Family and Consumer Science (FACS)",
        description: "Description 6",
        srcName: "facs"
    },
    {
        name: "Education",
        description: "Description 7",
        srcName: "education"
    },
    {
        name: "Agricultural Science",
        description: "Description 8",
        srcName: "agricultural-science"
    },
    {
        name: "JROTC",
        description: "Description 9",
        srcName: "jrotc"
    },
]

function newElement(tag, parent, text='', id='', classes=[], href='') {
    const e = document.createElement(tag);
    if (text != '') e.textContent = text;
    if (id   != '') e.id = id;
    if (href != '') e.href = href;

    if (classes != []) {
        for (let cls of classes) {
            e.classList.add(cls);
        }
    }

    document.getElementById(parent).appendChild(e);
}

pathways.forEach((pathway) => {
    const pathwayName = pathway.name;

    newElement(
        tag='a',
        parent='pathwayContents',
        text='',
        id=`${pathwayName}-container`,
        classes=['pathwayContainer'],
        href=`${pathway.srcName}.html`
    );

    newElement(
        tag='h3',
        parent=`${pathwayName}-container`,
        text=pathwayName,
        id=`${pathwayName}-container`,
        classes=['pathwayHeader'],
    );
    newElement(
        tag='p',
        parent=`${pathwayName}-container`,
        text=pathway.description,
        id=`${pathwayName}-container`,
        classes=['pathwayHeader'],
        href=`${pathway.srcName}.html`
    );

});