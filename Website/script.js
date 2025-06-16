const pathways = [
    {
        name: "Biomedical Science",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas harum quos mollitia possimus, quaerat reiciendis voluptas cum? Ratione vel voluptas commodi. Voluptatibus odio unde labore deserunt? Quia exercitationem asperiores consectetur?",
        srcName: "biomedical"
    },
    {
        name: "Computer Science",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas harum quos mollitia possimus, quaerat reiciendis voluptas cum? Ratione vel voluptas commodi. Voluptatibus odio unde labore deserunt? Quia exercitationem asperiores consectetur?",
        srcName: "computer-science"
    },
    {
        name: "Engineering",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas harum quos mollitia possimus, quaerat reiciendis voluptas cum? Ratione vel voluptas commodi. Voluptatibus odio unde labore deserunt? Quia exercitationem asperiores consectetur?",
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
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas harum quos mollitia possimus, quaerat reiciendis voluptas cum? Ratione vel voluptas commodi. Voluptatibus odio unde labore deserunt? Quia exercitationem asperiores consectetur?",
        srcName: "automation-technology"
    },
    {
        name: "Business",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas harum quos mollitia possimus, quaerat reiciendis voluptas cum? Ratione vel voluptas commodi. Voluptatibus odio unde labore deserunt? Quia exercitationem asperiores consectetur?",
        srcName: "business"
    },
    {
        name: "Family and Consumer Science (FACS)",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas harum quos mollitia possimus, quaerat reiciendis voluptas cum? Ratione vel voluptas commodi. Voluptatibus odio unde labore deserunt? Quia exercitationem asperiores consectetur?",
        srcName: "facs"
    },
    {
        name: "Education",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas harum quos mollitia possimus, quaerat reiciendis voluptas cum? Ratione vel voluptas commodi. Voluptatibus odio unde labore deserunt? Quia exercitationem asperiores consectetur?",
        srcName: "education"
    },
    {
        name: "Agricultural Science",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas harum quos mollitia possimus, quaerat reiciendis voluptas cum? Ratione vel voluptas commodi. Voluptatibus odio unde labore deserunt? Quia exercitationem asperiores consectetur?",
        srcName: "agricultural-science"
    },
    {
        name: "JROTC",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas harum quos mollitia possimus, quaerat reiciendis voluptas cum? Ratione vel voluptas commodi. Voluptatibus odio unde labore deserunt? Quia exercitationem asperiores consectetur?",
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