// GLobal variables
const excludedPrerequisites = ["ACT 19 Reading", "ACT 19 Math", "ACT 19 English", "GPA 2.0", "Job Required", "Must Audition", "Band or choir enrollment required"];
const courseMap = new Map();
const svg = document.getElementById('svg-lines');

// courseMap holds all courses and their subjects in a single, 1D array, no nesting needed
for (const [subject, offerings] of Object.entries(courses)) {
    for (const [offering, coursesArray] of Object.entries(offerings)) {
        for (const course of coursesArray) {
            
            // Add missing properties to each course (VERY IMPORTANT!)
            course.postrequisites = [];
            if (!("flex" in course)) {course.flex = "";}
            if (!("prerequisites" in course)) {course.prerequisites = [];}

            courseMap.set(course.name, { 
                ...course, 
                subject: subject,
            });
        }
    }
}

// Find all postrequisites for each class and push them to that courseMap class
for (const course of courseMap.values()) {
    for (const prerequisite of course.prerequisites || []) {
        if (courseMap.get(prerequisite)) {
            courseMap.get(prerequisite).postrequisites.push(course.name);
        }
    }
}
console.log(courses); console.log(courseMap);

// Uses svg to draw lines between elements
function drawLine(fromElem, from_xOffset, from_yOffset, toElem, to_xOffset, to_yOffset, color) {
    if (fromElem && toElem) {
       // Get bounding rectangles
       const fromRect = fromElem.getBoundingClientRect();
       const toRect = toElem.getBoundingClientRect();
       const svgRect = svg.getBoundingClientRect(); // Get SVG's position
 
       // Calculate start and end positions relative to the SVG container
       const x1 = fromRect.left + fromRect.width / 2 - svgRect.left + window.scrollX + from_xOffset;
       const y1 = fromRect.top + fromRect.height / 2 - svgRect.top + window.scrollY + from_yOffset;
 
       const x2 = toRect.left + toRect.width / 2 - svgRect.left + window.scrollX + to_xOffset;
       const y2 = toRect.top + toRect.height / 2 - svgRect.top + window.scrollY + to_yOffset;
 
       // Create an SVG line
       const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
       line.setAttribute('x1', x1);
       line.setAttribute('y1', y1);
       line.setAttribute('x2', x2);
       line.setAttribute('y2', y2);
 
       // Set the color for the line
       line.setAttribute('stroke', color);
       line.setAttribute('class', 'line');
 
       // Add the line to the SVG
       svg.appendChild(line);
    }
}

// Ensure the SVG is on top of other elements
svg.style.position = 'fixed'; // Ensures it stays in place
svg.style.pointerEvents = 'none'; // Prevents it from blocking clicks
svg.style.top = '0';
svg.style.left = '0';
svg.style.width = '100vw';
svg.style.height = '100vh';
svg.style.zIndex = '100'; // Max z-index value

// Creates a new element and appends it to a parent
function newElement(typeOfElement, parent, text, id, class1, class2, class3) {
    const e = document.createElement(typeOfElement);
    if (text   != '') { e.textContent = text; }
    if (id     != '') { e.id = id; }
    if (class1 != '') { e.className = class1; }
    if (class2 != '' && class2) { e.classList.add(class2); }
    if (class3 != '' && class3) { e.classList.add(class3); }
    document.getElementById(parent).appendChild(e);
}

// Collapses every subject at once
function collapseAll() {
    for (const [subject, offerings] of Object.entries(courses)) {
        for (const [offering, coursesArray] of Object.entries(offerings)) {
            document.getElementById(`${offering}_contents`).style.display = 'none';
            document.getElementById(`${offering}_header`).style.setProperty('--icon', '"➤"');
        }
    }
}

// Opens every subject at once
function openAll() {
    for (const [subject, offerings] of Object.entries(courses)) {
        for (const [offering, coursesArray] of Object.entries(offerings)) {
            document.getElementById(`${offering}_contents`).style.display = 'block';
            document.getElementById(`${offering}_header`).style.setProperty('--icon', '"⮟"');
        }
    }
}