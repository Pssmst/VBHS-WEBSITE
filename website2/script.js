const pathways = [
    {
        name: "Biomedical Science",
        description: "",
        srcName: "biomedical"
    },
    {
        name: "Computer Science",
        description: "",
        srcName: "computer-science"
    },
    {
        name: "Engineering",
        description: "",
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
        description: "",
        srcName: "automation-technology"
    },
    {
        name: "Business",
        description: "",
        srcName: "business"
    },
    {
        name: "Family and Consumer Science (FACS)",
        description: "",
        srcName: "facs"
    },
    {
        name: "Education",
        description: "",
        srcName: "education"
    },
    {
        name: "Agricultural Science",
        description: "",
        srcName: "agricultural-science"
    },
    {
        name: "JROTC",
        description: "",
        srcName: "jrotc"
    },
]

function newElement(typeOfElement, parent, text, id, class1, class2, class3) {
    const e = document.createElement(typeOfElement);
    if (text   != '') { e.textContent = text; }
    if (id     != '') { e.id = id; }
    if (class1 != '') { e.className = class1; }
    if (class2 != '' && class2) { e.classList.add(class2); }
    if (class3 != '' && class3) { e.classList.add(class3); }
    document.getElementById(parent).appendChild(e);
}

pathways.forEach((pathway) => {
    const pathwayName = pathway.name;

    const e = document.createElement('a');
    e.textContent = pathwayName;
    e.href = `${pathway.srcName}.html`;
    e.id = `${pathwayName}-container`;
    e.className = 'pathway';
    document.getElementById("pathways").appendChild(e);
});