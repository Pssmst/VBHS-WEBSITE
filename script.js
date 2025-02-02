// Create a lookup map for all courses
const courseMap = new Map();

// Initialize the course map and add a postrequisites property to each course
for (const [subject, offerings] of Object.entries(courses)) {
    for (const [offering, coursesArray] of Object.entries(offerings)) {
        for (const course of coursesArray) {
            course.postrequisites = []; // Assign each course a new postrequisites property :)
            courseMap.set(course.name.trim(), course);
        }
    }
}

// Match courses with their postrequisites
for (const [subject, offerings] of Object.entries(courses)) {
    for (const [offering, coursesArray] of Object.entries(offerings)) {
        for (const course of coursesArray) {
            for (const prerequisite of course.prerequisites) {
                const trimmedPrerequisite = prerequisite.trim();

                if (courseMap.has(trimmedPrerequisite)) {
                    const prerequisiteCourse = courseMap.get(trimmedPrerequisite);
                    prerequisiteCourse.postrequisites.push(course.name);
                }
            }
        }
    }
}
//console.log(courses); console.log(courseMap);

// Setup ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function newElement(typeOfElement, parent, text, id, class1, class2) {
    const newElement = document.createElement(typeOfElement);
    if (text   != '') { newElement.textContent = text; }
    if (id     != '') { newElement.id = id; }
    if (class1 != '') { newElement.className = class1; }
    if (class2 != '' && class2) { newElement.classList.add(class2); }
    document.getElementById(parent).appendChild(newElement);
}

function createPrerequisiteStat(course, titleText, statText, order) {
    newElement('div', `${course.name}_courseContainer`, titleText, 'preTitle', 'prerequisiteStat', order);
    newElement('div', `${course.name}_courseContainer`, statText, 'preNumber', 'prerequisiteStat', order);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function toggleCollapse(id, header_id) {
    const element = document.getElementById(id);
    const header = document.getElementById(header_id);
    
    if (element.style.display === 'none') {
        element.style.display = 'block';
        header.style.setProperty('--icon', '"⮟"'); // Change icon to right
    } else {
        element.style.display = 'none';
        header.style.setProperty('--icon', '"➤"'); // Change icon to down
    }
}

function collapseAll() {
    for (const [subject, offerings] of Object.entries(courses)) {
        for (const [offering, coursesArray] of Object.entries(offerings)) {
            document.getElementById(`${offering}_contents`).style.display = 'none';
            document.getElementById(`${offering}_header`).style.setProperty('--icon', '"➤"');
        }
    }
}

function openAll() {
    for (const [subject, offerings] of Object.entries(courses)) {
        for (const [offering, coursesArray] of Object.entries(offerings)) {
            document.getElementById(`${offering}_contents`).style.display = 'block';
            document.getElementById(`${offering}_header`).style.setProperty('--icon', '"⮟"');
        }
    }
}

const excludedPrerequisites = ["ACT 19 Reading", "ACT 19 Math", "ACT 19 English", "GPA 2.0", "Job Required", "Must Audition"];

for (const [subject, offerings] of Object.entries(courses)) {
    newElement('div', 'classContainer', '', subject, 'subjectContainer'); // Container for each subject (holds offerings)
    newElement('h1', subject, subject, '', 'subjectHeader'); // Heading for the subject
    
    for (const [offering, coursesArray] of Object.entries(offerings)) {
        newElement('div', subject, '', offering, 'offeringContainer'); // Container for offeringHeader and offeringContainer_contents
        newElement('h2', offering, offering, `${offering}_header`, 'offeringHeader'); // Header for the offering type
        newElement('div', offering, '', `${offering}_contents`, 'offeringContainer_contents'); // Container for each offering (holds specific courses)

        // Initialize the offering container as closed
        const offeringContents = document.getElementById(`${offering}_contents`);
        offeringContents.style.display = 'none'; // Hide the contents by default
        
        // Set the header icon to the closed state
        const offeringHeader = document.getElementById(`${offering}_header`);
        offeringHeader.style.setProperty('--icon', '"➤"'); // Icon pointing to the right
        offeringHeader.addEventListener('click', function() {
            toggleCollapse(`${offering}_contents`, `${offering}_header`);
        });

        for (const course of coursesArray) {
            // Create course elements as before
            newElement('div', `${offering}_contents`, '', `${course.name}_courseContainer`, 'courseContainer');

            // Use fancy logic to get a cool string like ○○●●○
            let gradesIndicator = "";
            for (let i = 0; i < course.grades.length; i+=2) {
                if      (course.grades[i] && course.grades[i+1])   {gradesIndicator += "●"} // true true
                else if (course.grades[i] && !course.grades[i+1])  {gradesIndicator += "◐"} // true false
                else if (!course.grades[i] && course.grades[i+1])  {gradesIndicator += "◑"} // false true
                else if (!course.grades[i] && !course.grades[i+1]) {gradesIndicator += "○"} // false false
            }
            
            // Create container and header
            newElement('h3', `${course.name}_courseContainer`, `${course.name}\u00A0 ${gradesIndicator}`, `${course.name}_courseHeader`, 'courseHeader');
            const courseHeader = document.getElementById(`${course.name}_courseHeader`);
            
            // Details ////////////////////////////////////////////////////////////////////////////////////

            // Create note underneath the course name (header)
            if (course.note) {
                newElement('p', `${course.name}_courseContainer`, `Note: ${course.note}`, '', 'note');
            }
            
            if (course.flex) {
                let flexStrings = [];
                for (flex of course.flex) {
                    if      (flex == "Science")              {flexStrings.push("3rd year Science")}
                    else if (flex == "Math")                 {flexStrings.push("4th year Math")}
                    else if (flex == "Civics")               {flexStrings.push("Civics")}
                    else if (flex == "World History")        {flexStrings.push("World History")}
                    else if (flex == "Math after Algebra 2") {flexStrings.push("4th year Math (after Algebra 2)")}
                }
                newElement('p', `${course.name}_courseContainer`, `Flex: Can count towards the ${flexStrings.join(' OR ')} graduation requirement.`, '', 'note', 'flex');
            }

            // Create details unordered list to add stuff to
            const ulDetails = document.createElement('ul');
            document.getElementById(`${course.name}_courseContainer`).appendChild(ulDetails);
            let details = [];

            if (course.doubleBlocked) {
                details.push(`Double-blocked class (2-period course!)`);
            }

            if (course.description.length > 0) {
                details.push(`${course.description}`);
            }

            // This sucks but whatever lmao
            if (course.prerequisites && course.prerequisites.length > 0) {

                if (course.prerequisites.includes("ACT 19 Reading") && course.prerequisites.includes("ACT 19 Math")) {
                    createPrerequisiteStat(course, "ACT Reading", "19+", 'ps_1');
                    createPrerequisiteStat(course, "ACT Math", "19+", 'ps_2');
                }
                else if (course.prerequisites.includes("ACT 19 Reading") && course.prerequisites.includes("GPA 2.0")) {
                    createPrerequisiteStat(course, "ACT Reading", "19+", 'ps_1');
                    createPrerequisiteStat(course, "ACT English", "19+", 'ps_2');
                    createPrerequisiteStat(course, "GPA", "2.0+", 'ps_3');
                }
                else if (course.prerequisites.includes("ACT 19 Reading")) {
                    createPrerequisiteStat(course, "ACT Reading", "19+", 'ps_1');
                }
                else if (course.prerequisites.includes("Job Required")) {
                    createPrerequisiteStat(course, "Requires", "Job", 'ps_1');
                }
                else if (course.prerequisites.includes("Must Audition")) {
                    createPrerequisiteStat(course, "Must", "audition", 'ps_4');
                }

                const filteredPrerequisites = course.prerequisites.filter(item => !excludedPrerequisites.includes(item));
                if (filteredPrerequisites.length > 0) {
                    filteredPrerequisites
                    details.push(`${filteredPrerequisites.length == 1 ? "Prerequisite: " : "Prerequisites: "} ${filteredPrerequisites.join(', ')}`);
                }
            }

            if (course.postrequisites.length > 0) {
                details.push(`Prerequisite to: ${course.postrequisites.join(', ')}`);
            }

            details.push(`Credits: ${course.credits} (${course.courseLength == 1 ? "One-year" : "One-semester"})`);
            if (course.occurences > 1) {
                details.push(`Can take ${course.occurences} times`);
            }

            if (course.honors) {
                courseHeader.classList.add('honors');
            }

            if (course.advancedPlacement) {
                details.push("Weighted on a 5-point scale");
                courseHeader.classList.add('advancedPlacement');
            }

            if (course.CONC) {
                details.push(`Concurrent through ${course.CONC}`);
                courseHeader.classList.add('CONC');
            }

            let courseCodeString = (course.courseCode != -1 ? `#${course.courseCode}` : 'WATC');
            newElement('p', `${course.name}_courseContainer`, courseCodeString, '', 'courseCode');

            for (const detail of details) {
                const detailLi = document.createElement('li');
                detailLi.textContent = detail;
                ulDetails.appendChild(detailLi);
            }
        }
    }
}

// Table stuff & course selection ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function findAllowedGrades(grades) {
    let allowedGrades = [];
    for (let i = 0; i < grades.length; i++) {
        if (grades[i]) {
            allowedGrades.push(i+1);
        }
    }
    return allowedGrades;
}

function getLeftmostTH(elementUnderCursor) {
    // Ensure the elementUnderCursor is a table cell (TD or TH)
    if (elementUnderCursor && (elementUnderCursor.tagName === 'TD' || elementUnderCursor.tagName === 'TH')) {
        const row = elementUnderCursor.parentElement;
        const leftmostCell = row.querySelector('td, th'); // Selects the first TD or TH in the row
        return leftmostCell ? leftmostCell.textContent : null;
    }
    return null;
}

let papAlgebra1Taken = false;

function getFulfilledPrerequisites(elementUnderCursor, prerequisites, courseLength) {
    // Remove excluded prerequisites
    prerequisites = prerequisites.filter(prerequisite => !excludedPrerequisites.includes(prerequisite));
    let prereqsUsed = {};

    // Prevents cells from being placed directly underneath or above their prerequisites---ONLY in front
    // Changes depending whether it's a semester-long class or not
    let offset;
    if (courseLength == 1) { offset = 2; }
    else { offset = 1; }
    
    if (prerequisites && prerequisites.length > 0) {
        if (elementUnderCursor.tagName === 'TD') {
            const table = document.getElementById('table');
            const cellIndex = elementUnderCursor.cellIndex; // Get column index of the current cell

            if (table) {
                // Loop through each row of the table
                Array.from(table.rows).forEach(row => {
                    // Iterate over the cells to the left of the current cell
                    for (let i = cellIndex - offset; i >= 1; i--) {
                        const cell = row.cells[i];
                        if (cell) {
                            for (const prerequisite of prerequisites) {
                                if (cell.textContent.includes(prerequisite)) {
                                    prereqsUsed[prerequisite] = true;
                                }
                                // Account for the algebra 1 checkbox
                                else if (prerequisite === "PAP Algebra 1" && papAlgebra1Taken) {
                                    prereqsUsed[prerequisite] = true;
                                }
                                // Only set to false if the prerequisite hasn't been set to true yet
                                else if (!(prerequisite in prereqsUsed)) {
                                    prereqsUsed[prerequisite] = false;
                                }
                            }
                        }
                    }
                });
            }
        }
    } else { 
        return {"": true}; // Return true by default dictionary if prerequisites are empty
    }

    return prereqsUsed;
}

function setCellModifiers(course, elementUnderCursor, allowedSubjects) {
    elementUnderCursor.textContent = course.name;
    elementUnderCursor.classList.add('occupied');
    if (course.honors)            { elementUnderCursor.classList.add('honors'); }
    if (course.advancedPlacement) { elementUnderCursor.classList.add('advancedPlacement'); }
    if (course.CONC)              { elementUnderCursor.classList.add('CONC'); }
    if (course.CONC)              { elementUnderCursor.classList.add('CONC'); }
    if (!allowedSubjects)         { elementUnderCursor.classList.add('extraElective'); }
}

const tableCells = document.querySelectorAll('td');

// Surprise tool for later (contains all courses that are in the table)
let coursesInTable = [];
            
for (const [subject, offerings] of Object.entries(courses)) {
    for (const [offering, coursesArray] of Object.entries(offerings)) {
        for (const course of coursesArray) {

            const courseElement = document.getElementById(`${course.name}_courseContainer`);


            courseElement.addEventListener('click', function (event) {
                if (courseElement.classList.contains('used')) return;

                const courseContainer = document.querySelector(`[id="${course.name}_courseContainer"]`);
                courseContainer.classList.add('clicked'); // Start the rotation

                // Create the mousebox
                const mouseBox = document.createElement('div');
                document.body.appendChild(mouseBox);

                // Determine size and contents
                if (course.courseLength == 1) {
                    mouseBox.style.width = `160px`;
                    mouseBox.style.height = `60px`;
                }
                else {
                    mouseBox.style.width = `80px`;
                    mouseBox.style.height = `80px`;
                }
                mouseBox.textContent = course.name;

                // MouseBox modifiers
                mouseBox.classList.add('mouseBox');
                mouseBox.id = 'mouseBox';
                if (course.honors) { mouseBox.classList.add('honors'); }
                if (course.CONC) { mouseBox.classList.add('CONC'); }
                if (course.advancedPlacement) { mouseBox.classList.add('advancedPlacement'); }
                if (course.flex) { newElement('div', 'mouseBox', 'flex', 'flexAppendage'); }

                function moveBox(e) {
                    mouseBox.style.position = 'absolute';
                    // Places mouse in center of mousebox
                    mouseBox.style.left = `${e.pageX - mouseBox.clientWidth/2}px`;
                    mouseBox.style.top = `${e.pageY - mouseBox.clientHeight/2}px`;

                    // Iterate through every cell for gaming purposes
                    tableCells.forEach(cell => {
                        const allowedSubjects = [subject, "Elective 1", "Elective 2", "Elective 3"].includes(getLeftmostTH(cell));
                        const allowedCertainGrades = findAllowedGrades(course.grades).includes(Number(cell.id[1]));
                        
                        // Unavailable cells (i forgot how it works lmao)
                        if (!(allowedSubjects && allowedCertainGrades)) {
                            cell.classList.add('unavailable');
                        }
                        
                    });
                }

                function resetAvailability() {
                    tableCells.forEach(cell => cell.classList.remove('unavailable'));
                    //tableCells.forEach(cell => cell.classList.remove('extraElectiveSpot'));
                }

                function handleDrop(e) {
                    let elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);

                    // Do same logic as in the moveBox function but instead of for each cell, it's for the elementUnderCursor
                    const allowedCertainGrades = findAllowedGrades(course.grades).includes(Number(elementUnderCursor.id[1]));

                    // See if any prerequisite is not fulfilled
                    const fulfilledPrerequities = getFulfilledPrerequisites(elementUnderCursor, course.prerequisites, course.courseLength);
                    let allPrerequisitesFulfilled = !Object.values(fulfilledPrerequities).some(fulfilled => !fulfilled);

                    if (elementUnderCursor && elementUnderCursor.tagName === 'TD' && allowedCertainGrades && allPrerequisitesFulfilled) {

                        // Handle previous class if it exists
                        if (elementUnderCursor.textContent.trim()) {
                            const previousClassName = elementUnderCursor.textContent.trim();
                            const previousClassContainer = document.getElementById(`${previousClassName}_courseContainer`);
                            if (previousClassContainer) {
                                previousClassContainer.classList.remove('used');
                            }
                        }
                        
                        // Surprise tool for later
                        const allowedSubjects = [subject, "Elective 1", "Elective 2", "Elective 3"].includes(getLeftmostTH(elementUnderCursor));
                
                        // Place the new class
                        if (course.courseLength === 1) {
                            if (Number(elementUnderCursor.id[1]) % 2 === 0) {
                                elementUnderCursor = elementUnderCursor.previousElementSibling;
                            }
                            const nextCell = elementUnderCursor.nextElementSibling;
                
                            if (nextCell && nextCell.tagName === 'TD' && !nextCell.textContent.trim()) {
                                elementUnderCursor.setAttribute('colspan', '2');
                                nextCell.style.display = 'none';
                                setCellModifiers(course, elementUnderCursor, allowedSubjects);
                        
                            }
                        }
                        // If the course is a semester course and the cell under the cursor is empty
                        else if (!elementUnderCursor.textContent) {
                            setCellModifiers(course, elementUnderCursor, allowedSubjects);
                        }
                    }

                    // Scan all cells for cell contents
                    let tableHasAlgebra2AndWhere = [false, ''];
                    tableCells.forEach(cell => {
                        if (cell.textContent) {
                            coursesInTable.push(courseMap.get(cell.textContent)); // Thank goodness I made that courseMap earlier
                            
                            const courseContainer = document.getElementById(`${cell.textContent.trim()}_courseContainer`);
                            if (courseContainer) {
                                courseContainer.classList.add('used');
                            }
                        }

                        if (cell.textContent.includes("Algebra 2")) {
                            tableHasAlgebra2AndWhere = [true, cell.id];
                        }
                    });

                    // Find flex courses in table and then determine what spots are available for extra electives
                    for (let courseInTable of coursesInTable) {
                        if (courseInTable.flex) {
                            for (flex of courseInTable.flex) {
                                if (flex == "Science") {
                                    document.getElementById('s5').classList.add('extraElectiveSpot');
                                    document.getElementById('s6').classList.add('extraElectiveSpot');
                                }
                                if (flex == "Math") {
                                    document.getElementById('m7').classList.add('extraElectiveSpot');
                                    document.getElementById('m8').classList.add('extraElectiveSpot');
                                }
                                if (flex == "Math after Algebra 2" && tableHasAlgebra2AndWhere[0]) {
                                    for (let id = Number(tableHasAlgebra2AndWhere[1])+2; id <= 8; id++) {
                                        document.getElementById(`m${id}`).classList.add('extraElectiveSpot');
                                    }
                                }
                                if (flex == "World History") {
                                    console.log("CHANGE COURSES IN THE COURSE CATALOG AND DISPLAY AS FULFILLED BENEATH");
                                }
                                if (flex == "Civics") {
                                    console.log("CHANGE COURSES IN THE COURSE CATALOG AND DISPLAY AS FULFILLED BENEATH");
                                }
                            }
                        }
                    }
                    // ^^ COOL, now find a way to REMOVE that once the class is gone

                    cleanup();
                }
                
                // General cleanup function
                function cleanup() {
                    resetAvailability();
                    courseContainer.classList.remove('clicked');
                    document.removeEventListener('mousemove', moveBox);
                    document.removeEventListener('mouseup', handleDrop);
                    mouseBox.remove();
                }

                document.addEventListener('mousemove', moveBox);
                document.addEventListener('click', function handleClick(event) {
                    moveBox(event); // Trigger moveBox animation on click
                    resetAvailability(); // Clear unavailable cells
                    document.removeEventListener('click', handleClick); // Ensure resetAvailability only runs once
                });
                document.addEventListener('mouseup', handleDrop);
            });
        }
    }
}

// Double-click listener to handle unmerging of cells
tableCells.forEach(cell => {
    cell.addEventListener('dblclick', function() {
        
        cell.classList.remove('occupied');
        cell.classList.remove('honors');
        cell.classList.remove('advancedPlacement');
        cell.classList.remove('CONC');
        cell.classList.remove('extraElective');

        courseContainer = document.querySelector(`[id="${cell.textContent}_courseContainer"]`);
        if (courseContainer) { courseContainer.classList.remove('used'); }

        // If the cell has merged (colspan="2"), unmerge it
        if (cell.getAttribute('colspan') === '2') {
            cell.removeAttribute('colspan');

            // Reset the colspan to 1 and show the next cell
            const nextCell = cell.nextElementSibling;
            cell.style.display = '';
            nextCell.textContent = '';
            nextCell.style.display = '';
        }
        cell.textContent = ''; 
    });
});

// Search bar ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let subjectNames = [];
let offeringNames = [];
for (const [subject, offerings] of Object.entries(courses)) {
    subjectNames.push(subject);
    for (const [offering, coursesArray] of Object.entries(offerings)) {
        offeringNames.push(offering);
    }
}

const searchboxNames = document.getElementById('searchboxNames');
const creditHalf = document.getElementById('creditHalf');
const credit1 = document.getElementById('credit1');
const credit2 = document.getElementById('credit2');
const freshman = document.getElementById('freshman');
const sophomore = document.getElementById('sophomore');
const junior = document.getElementById('junior');
const senior = document.getElementById('senior');
const honors = document.getElementById('honors');
const conc = document.getElementById('conc');
const ap = document.getElementById('ap');

searchboxNames.addEventListener('input', () => search());
creditHalf.addEventListener('input', () => search());
credit1.addEventListener('input', () => search());
credit2.addEventListener('input', () => search());
freshman.addEventListener('input', () => search());
sophomore.addEventListener('input', () => search());
junior.addEventListener('input', () => search());
senior.addEventListener('input', () => search());
honors.addEventListener('input', () => search());
conc.addEventListener('input', () => search());
ap.addEventListener('input', () => search());

function search() {
    const searchString = searchboxNames.value.trim().toLowerCase();

    let numOfCoursesFound = 0;

    // Iterate through subjects, offerings, and courses
    for (const [subject, offerings] of Object.entries(courses)) {
        for (const [offering, coursesArray] of Object.entries(offerings)) {
            for (const course of coursesArray) {
                let elementToHide = document.getElementById(`${course.name}_courseContainer`);
                if (elementToHide) {

                    // Determine if course matches name search
                    const matchesName = (searchString === "" || course.name.toLowerCase().includes(searchString));

                    // Determine if course matches credit filter
                    const matchesCredit =
                        (creditHalf.checked && course.credits === 0.5) ||
                        (credit1.checked && course.credits === 1) ||
                        (credit2.checked && course.credits === 2) ||
                        (!creditHalf.checked && !credit1.checked && !credit2.checked);
                    
                    // Determine if course matches grades filter
                    const matchesGrades =
                        (freshman.checked && (course.grades[0] || course.grades[1])) ||
                        (sophomore.checked && (course.grades[2] || course.grades[3])) ||
                        (junior.checked && (course.grades[4] || course.grades[5])) ||
                        (senior.checked && (course.grades[6] || course.grades[7])) ||
                        (!freshman.checked && !sophomore.checked && !junior.checked && !senior.checked);
                    
                    // Determine if course matches level filter
                    const matchesLevel =
                        (honors.checked && course.honors && course.CONC == undefined && course.advancedPlacement == undefined) ||
                        (conc.checked && course.CONC && course.CONC.length > 0) ||
                        (ap.checked && course.advancedPlacement) ||
                        (!honors.checked && !conc.checked && !ap.checked);

                    if (matchesName && matchesCredit && matchesGrades && matchesLevel) {
                        elementToHide.classList.remove('notDiscoveredBySearch');
                        numOfCoursesFound++;
                    } else {
                        elementToHide.classList.add('notDiscoveredBySearch');
                    }
                }
            }
        }
    }

    // Update search results display
    const resultsText = numOfCoursesFound === 1 ? "1 course found." : `${numOfCoursesFound} courses found.`;
    document.getElementById('searchbarResults').textContent = resultsText;

    // Check and update visibility for offerings and subjects
    updateVisibility();
}

// Update visibility of offerings and subjects
function updateVisibility() {
    for (const offeringName of offeringNames) {
        const offeringContainer = document.getElementById(offeringName);
        const offeringContents = document.getElementById(`${offeringName}_contents`);
        const courseContainers = offeringContents.querySelectorAll(':scope > div');

        const allHiddenCourses = Array.from(courseContainers).every(child =>
            child.classList.contains('notDiscoveredBySearch')
        );

        if (allHiddenCourses) {
            offeringContainer.classList.add('notDiscoveredBySearch');
        } else {
            offeringContainer.classList.remove('notDiscoveredBySearch');
        }
    }

    for (const subjectName of subjectNames) {
        const subjectContainer = document.getElementById(subjectName);
        const offeringContainers = subjectContainer.querySelectorAll(':scope > div');

        const allHiddenOfferings = Array.from(offeringContainers).every(child =>
            child.classList.contains('notDiscoveredBySearch')
        );

        if (allHiddenOfferings) {
            subjectContainer.classList.add('notDiscoveredBySearch');
        } else {
            subjectContainer.classList.remove('notDiscoveredBySearch');
        }
    }
}

// Course pathways ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const svg = document.getElementById('svg-lines');

// Function to remove all tile divs
function removeAllTiles() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.remove();
    });
}

// Find first possible occurrence of a class (using its available grades)
function getFirstOccurrence(course) {
    for (let i = 1; i <= course.grades.length; i++) {
        if (course.grades[i - 1]) {
            return i;
        }
    }
}

// Function to calculate positions and draw lines with pathway colors
function drawLines(pathways) {
    svg.innerHTML = ''; // Clear existing lines

    // Draw each line
    Object.values(pathways).forEach(pathway => {
        pathway.connections.forEach(({ from, to }) => {
            const fromElem = document.getElementById(from);
            const toElem = document.getElementById(to);

            // For line drawing...
            const x_offset = 19;
            const y_offset = 42;

            if (fromElem && toElem) {
                // Get bounding rectangles
                const fromRect = fromElem.getBoundingClientRect();
                const toRect = toElem.getBoundingClientRect();

                // Calculate start and end positions
                const x1 = fromRect.right - x_offset;
                const y1 = fromRect.top + (fromRect.height / 2) - y_offset;
                const x2 = toRect.left - x_offset + 1;
                const y2 = toRect.top + (toRect.height / 2) - y_offset;

                // Create an SVG line
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);

                // Set the color for the line based on the pathway
                line.setAttribute('stroke', pathway.color);
                line.setAttribute('class', 'line');

                // Add the line to the SVG
                svg.appendChild(line);
            }
        });
    });
}

// This is the big one
function generatePathways(specifiedPathwayID) {
    //console.clear()
    const minColor = 20;
    const maxColor = 255;

    let pathways = {}; // Object to hold pathway groups and their colors
    let pathwayID = 1; // Pathway counter for assigning unique colors

    // A lazy approach to prevent duplicate courses :)
    let previousCourses = [];
    let currentCourses = [];

    // Traverse the courses by pathways
    for (const [subject, offerings] of Object.entries(courses)) {
        for (const [offering, coursesArray] of Object.entries(offerings)) {
            for (const course of coursesArray) {

                const allPrerequisitesAreStats = course.prerequisites.every(stat => excludedPrerequisites.includes(stat))
                if ((course.prerequisites.length > 0 || course.postrequisites.length > 0) && !allPrerequisitesAreStats) {

                    // Start a new pathway if the course is not discovered
                    if (!pathways[pathwayID]) {
                        // Apply random color
                        pathways[pathwayID] = { connections: [], color: `rgb(${getRandomInt(minColor, maxColor)}, ${getRandomInt(minColor, maxColor)}, ${getRandomInt(minColor, maxColor)})` };
                    }

                    let stack = [course.name]; // Stack is, like, a list of the branches or whatever
                    let currentPathway = new Set(); // Track courses discovered in this pathway

                    while (stack.length > 0) {
                        let currentCourseName = stack.pop();
                        currentCourses.push(currentCourseName);

                        if (currentPathway.has(currentCourseName)) { continue; }  // Skip if the course is already in this pathway
                        currentPathway.add(currentCourseName);                    // Add courseName to currentPathway
                        const currentCourse = courseMap.get(currentCourseName);   // Find the course object
                        
                        // Ensure the course tile exists (if it doesn't, make one)
                        // THIS STUPID BLOCK OF CODE HAS BEEN THE ROOT OF MY PROBLEMS FOR 14 HOURS NOW AND I JUST FIGURED IT OUT AND I AM SO MAD
                        if (!document.getElementById(currentCourseName)) {
                            if (pathwayID == specifiedPathwayID || specifiedPathwayID == 0) {
                                if (papAlgebra1Taken && currentCourseName == "PAP Algebra 1") {
                                    newElement('div', 0, currentCourseName, currentCourseName, 'tile');
                                }
                                else {
                                    newElement('div', getFirstOccurrence(currentCourse), currentCourseName, currentCourseName, 'tile');
                                }
                            }
                        }

                        // Add connections for this course
                        for (const prerequisite of currentCourse.prerequisites) {
                            if (!excludedPrerequisites.includes(prerequisite)) { // Gotta make sure to excldue the stat prerequisites :(
                                pathways[pathwayID].connections.push({ from: prerequisite, to: currentCourseName });
                                stack.push(prerequisite); // Add to stack to discover connected courses
                            }
                        }

                        // Explore courses connected by `postrequisites`
                        for (const postrequisites of currentCourse.postrequisites) {
                            pathways[pathwayID].connections.push({ from: currentCourseName, to: postrequisites });
                            stack.push(postrequisites); // Add to stack to discover connected courses
                        }
                    }

                    const allElementsFound = currentCourses.every(course => previousCourses.includes(course));
                    //console.log(pathwayID, previousCourses, currentCourses);

                    if (!allElementsFound || currentCourses[0] == previousCourses[0]) {
                        previousCourses = currentCourses;
                        pathwayID++;
                    }
                    currentCourses = [];
                }
            }
        }
    }

    // Update line positions with pathway colors
    document.getElementById("pathwayData").textContent = (specifiedPathwayID === 0 ? "All Pathways" : `Pathway ${specifiedPathwayID}` + ` of ${pathwayID}`);
    drawLines(pathways);
    return pathwayID;
}

let specifiedPathwayID = 1;
let numOfPathways = generatePathways(specifiedPathwayID);


function openPathways() {
    document.getElementById('table').classList.add('hidden');
    document.getElementById('pathwayContainer').classList.remove('hidden');

    numOfPathways = generatePathways(specifiedPathwayID);
}

function openTable() {
    svg.innerHTML = ''; // Clear existing lines
    document.getElementById('pathwayContainer').classList.add('hidden');
    document.getElementById('table').classList.remove('hidden');
}

function incrementPathwayID() {
    if (specifiedPathwayID < numOfPathways) {
        specifiedPathwayID++;
        removeAllTiles(); // Remove all tiles before generating new pathways
        numOfPathways = generatePathways(specifiedPathwayID);
    }
}

function decrementPathwayID() {
    if (specifiedPathwayID > 1) { // Ensure pathway ID doesn't go below 1 (an ID of 0 shows all pathways at once as a dev tool)
        specifiedPathwayID--;
        removeAllTiles(); // Remove all tiles before generating new pathways
        numOfPathways = generatePathways(specifiedPathwayID);
    }
}

function setPAPAlgebra1ToUsed() {
    if (!papAlgebra1Taken) { document.getElementById(`PAP Algebra 1_courseContainer`).classList.add('used'); }
    else { document.getElementById(`PAP Algebra 1_courseContainer`).classList.remove('used'); }
    papAlgebra1Taken = !papAlgebra1Taken;

    // Do pathway stuff
    removeAllTiles();
    numOfPathways = generatePathways(specifiedPathwayID);
}