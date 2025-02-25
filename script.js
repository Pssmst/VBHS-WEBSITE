// Line tool ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const svg = document.getElementById('svg-lines');

function drawLine(fromElem, toElem, color, x_offset, y_offset) {
    if (fromElem && toElem) {
       // Get bounding rectangles
       const fromRect = fromElem.getBoundingClientRect();
       const toRect = toElem.getBoundingClientRect();
       const svgRect = svg.getBoundingClientRect(); // Get SVG's position
 
       // Calculate start and end positions relative to the SVG container
       const x1 = fromRect.left + fromRect.width / 2 - svgRect.left + window.scrollX;
       const y1 = fromRect.top + fromRect.height / 2 - svgRect.top + window.scrollY;
 
       const x2 = toRect.left + toRect.width / 2 - svgRect.left + window.scrollX + x_offset;
       const y2 = toRect.top + toRect.height / 2 - svgRect.top + window.scrollY + y_offset;
 
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

// Setup ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const courseMap = new Map(); // Create a lookup map for all courses

// First pass: Populate courseMap with enhanced course objects
for (const [subject, offerings] of Object.entries(courses)) {
    for (const [offering, coursesArray] of Object.entries(offerings)) {
        for (const course of coursesArray) {
            
            // Add missing properties to each course (VERY IMPORTANT!)
            course.postrequisites = [];
            if (!("flex" in course)) {course.flex = "";}

            courseMap.set(course.name, { 
                ...course, 
                subject: subject,
            });
        }
    }
}

// Second pass: Link postrequisites
for (const course of courseMap.values()) {
    for (const prerequisite of course.prerequisites || []) {
        const prerequisiteCourse = courseMap.get(prerequisite);
        if (prerequisiteCourse) {
            prerequisiteCourse.postrequisites.push(course.name);
        }
    }
}
//console.log(courses); console.log(courseMap);

function newElement(typeOfElement, parent, text, id, class1, class2, class3) {
    const newElement = document.createElement(typeOfElement);
    if (text   != '') { newElement.textContent = text; }
    if (id     != '') { newElement.id = id; }
    if (class1 != '') { newElement.className = class1; }
    if (class2 != '' && class2) { newElement.classList.add(class2); }
    if (class3 != '' && class3) { newElement.classList.add(class3); }
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
            
            if (course.flex.length > 0) {
                let flexStrings = [];
                if      (course.flex == "Science")              {flexStrings.push("3rd year Science")}
                else if (course.flex == "Math")                 {flexStrings.push("4th year Math")}
                else if (course.flex == "Civics")               {flexStrings.push("Civics")}
                else if (course.flex == "World History")        {flexStrings.push("World History")}
                else if (course.flex == "Math after Algebra 2") {flexStrings.push("4th year Math (after Algebra 2)")}
                else if (course.flex == "Science OR Math")      {flexStrings.push("3rd year Science", "4th year Math")}
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

// TABLE STUFF ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getLeftmostTH(elementUnderCursor) {
    // Ensure the elementUnderCursor is a table cell (TD or TH)
    if (elementUnderCursor && (elementUnderCursor.tagName === 'TD' || elementUnderCursor.tagName === 'TH')) {
        const row = elementUnderCursor.parentElement;
        const leftmostCell = row.querySelector('td, th'); // Selects the first TD or TH in the row
        return leftmostCell ? leftmostCell.textContent : null;
    }
    return null;
}

function getTextContent(cell) {
    // Get only text nodes (ignores child elements)
    const textContent = Array.from(cell.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent.trim())
    .join(' ');

    return textContent;
}

let algebra1Taken = false;

function getFulfilledPrerequisites(elementUnderCursor, prerequisites, courseLength) {
    // Remove excluded prerequisites
    prerequisites = prerequisites.filter(prerequisite => !excludedPrerequisites.includes(prerequisite));
    if (prerequisites.length === 0) return { "": true }; // Return early if no prerequisites
 
    let prereqsUsed = {};
    const offset = courseLength === 1 ? 2 : 1; // Define offset based on course length
 
    if (elementUnderCursor.tagName !== 'TD') return prereqsUsed; // Ensure we are processing a table cell
 
    const table = document.getElementById('table');
    if (!table) return prereqsUsed;
 
    const cellIndex = elementUnderCursor.cellIndex; // Get column index
 
    // Handle special case where placing in the first semester (index 0)
    if (cellIndex - offset === -1) {
        for (const prerequisite of prerequisites) {
            prereqsUsed[prerequisite] = prerequisite === "PAP Algebra 1" && (algebra1Taken ? true : false);
        }
       return prereqsUsed;
    }
 
    // Iterate through all rows and check prerequisites
    Array.from(table.rows).forEach(row => {
        
        /* ITERATE THROUGH CELLS IN THE ROW
            cellIndex = the current horizontal index of the cell (freshman year semester 1 = 1, senior year semester 2 = 8)
            offset = 2 for year-long classes, 1 for semester-long classes
            i >= 0; stops at subject column (index 0)
            i--; goes backwards from the year to the left of the cell to the subject column
        */
        for (let i = (cellIndex - offset); i >= 0; i--) {
            const cell = row.cells[i];
            if (!cell) continue;

            for (const prerequisite of prerequisites) {
                if (getTextContent(cell).includes(prerequisite)) {
                    prereqsUsed[prerequisite] = true;
                } else if (!(prerequisite in prereqsUsed)) {
                    prereqsUsed[prerequisite] = prerequisite === "PAP Algebra 1" && (algebra1Taken ? true : false);
                }
            }
        }
    });
    return prereqsUsed;
}
 
// Takes in a cell and sees if it should be unavailable
function determineIfUnavailable(subject, course, cell) {
    const allowedSubjects = [subject, "Elective 1", "Elective 2", "Elective 3"].includes(getLeftmostTH(cell));

    let allowedGradesArray = [];
    for (let i = 0; i < course.grades.length; i++) {
        if (course.grades[i]) {
            allowedGradesArray.push(i+1);
        }
    }

    const allowedGrades = allowedGradesArray.includes(Number(cell.id[1]));
    const isFlexSpot = cell.classList.contains('flexCourseSpot');
    return [allowedSubjects, allowedGrades, isFlexSpot];
}

// Set cell modifiers (class, text, etc.)
function setCellModifiers(course, elementUnderCursor) {
    elementUnderCursor.textContent = course.name;
    elementUnderCursor.classList.add('occupied');

    if (course.honors)            { elementUnderCursor.classList.add('honors'); }
    if (course.advancedPlacement) { elementUnderCursor.classList.add('advancedPlacement'); }
    if (course.CONC)              { elementUnderCursor.classList.add('CONC'); }

    if (!course.honors && !course.advancedPlacement && !course.CONC) { elementUnderCursor.classList.add('regular'); }
}

// FLEX CRAP ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let advancedFlexbars = {};

function toggleFlexCourse(condition, cellIds, ifAdd) {
    cellIds.forEach(id => {
        const cell = document.getElementById(id);
        if (cell && condition) {
            if (ifAdd) {
                cell.classList.add('flexCourseSpot');
            } else {
                cell.classList.remove('flexCourseSpot');
            }
        }
    });
}

// Scan all cells
function evaluateCoursesInTable(ifAdd) {
    let coursesInTable = [];
    tableCells.forEach(cell => {
        // Thank goodness I made that courseMap earlier
        if (courseMap.get(getTextContent(cell))) {
            coursesInTable.push([courseMap.get(getTextContent(cell)), cell.id]);
        }
        const courseContainer = document.getElementById(`${getTextContent(cell)}_courseContainer`);
        if (courseContainer) { courseContainer.classList.add('used'); }
    });

    // Find flex courses in table and then determine what spots are available for extra electives
    if (coursesInTable.length > 0) {
        toggleFlexCourse(true, ["s5", "s6", "m7", "m8"], false);
        for (let courseInTable of coursesInTable) {
            if (courseInTable && courseInTable[0].flex) { // Check if it's valid
                toggleFlexCourse(courseInTable[0].flex === "Science", ["s5", "s6"], ifAdd);
                toggleFlexCourse((courseInTable[0].flex === "Math") || (courseInTable[0].flex === "Math after Algebra 2" && (getFulfilledPrerequisites(elementUnderCursor, ["Algebra 2"], 1)["Algebra 2"] || getFulfilledPrerequisites(elementUnderCursor, ["Honors Algebra 2"], 1)["Honors Algebra 2"])), ["m7", "m8"], ifAdd);
                toggleFlexCourse(courseInTable[0].flex === "World History", ["h3", "h4"], ifAdd);

                if (courseInTable[0].flex === "Science OR Math" && advancedFlexbars[courseInTable[1]]) {
                    index = advancedFlexbars[courseInTable[1]][0];

                    if (advancedFlexbars[courseInTable[1]][1][index] === "Science") {
                        toggleFlexCourse(true, ["s5", "s6"], ifAdd);
                    }
                    else if (advancedFlexbars[courseInTable[1]][1][index] === "Math") {
                        toggleFlexCourse(true, ["m7", "m8"], ifAdd);
                    }
                }
            }
        }
    }
}

// Determine which extra electives are available through flex classes and which ones are risky
function determineWhichEE() {
    const flexCourseIndicators = document.querySelectorAll('.flexCourseIndicator');
    flexCourseIndicators.forEach(element => {
        element.remove();
    });

    // Iterate through every cell and determine whether it's an EE given by a flex course or an EE that is from a plain unavailable cell
    tableCells.forEach(cell => {
        const subject = courseMap.get(getTextContent(cell))?.subject;
        const course = courseMap.get(getTextContent(cell)); // May sometimes be false bc of empty cells

        // If cell name exists in the courseMap...
        if (course) {
            [allowedSubjects, allowedGrades, isFlexSpot] = determineIfUnavailable(subject, course, cell);

            // If unavailable...
            if (!(allowedSubjects && allowedGrades)) {
                cell.classList.add('extraElective');

                // Extra elective (WITH flex credit substituting it) [GOOD]
                if (isFlexSpot) {
                    newElement('div', cell.id, 'EE', `${cell.id}_extraElectiveGood`, 'extraElectiveGoodIndicator', 'indicator');

                    // Remove badIndicator
                    const badIndicator = document.getElementById(`${cell.id}_extraElectiveBad`);
                    if (badIndicator) { badIndicator.remove(); }
                }

                // Extra elective (WITHOUT flex credit substituting it) [BAD]
                else {
                    cell.classList.add('extraElective');
                    newElement('div', cell.id, 'EE', `${cell.id}_extraElectiveBad`, 'extraElectiveBadIndicator', 'indicator');

                    // Remove goodIndicator
                    const goodIndicator = document.getElementById(`${cell.id}_extraElectiveGood`);
                    if (goodIndicator) { goodIndicator.remove(); }
                }
            }

            // Flex course indicator
            if (course.flex && course.flex.length > 0) {
                cell.classList.add('flexCourse');
                
                if (course.flex === "Science OR Math") {
                    advancedFlexbars[cell.id] = [0, ['Science', 'Math']];
                    newElement('div', cell.id, 'flex (science)', '', 'flexCourseIndicator', 'indicator', 'advancedBar');
                    evaluateCoursesInTable(true);
                }
                else {
                    newElement('div', cell.id, 'flex', '', 'flexCourseIndicator', 'indicator');
                }
            }

            // Listen for clicks on the parent element and filter by class
            document.addEventListener('click', (event) => {
                if (event.target && event.target.classList.contains('advancedBar')) {
                    index = (advancedFlexbars[cell.id][0] + 1) % 2;
                    advancedFlexbars[cell.id][0] = index;
                    event.target.textContent = `flex (${advancedFlexbars[cell.id][1][index].toLowerCase()})`;
                    evaluateCoursesInTable(true);

                    console.log(advancedFlexbars);
                }
            });
        }
    });
}

// CONTINUE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateLinesFromMouseBox(course) {
    svg.innerHTML = ''; // Clear existing lines
    const fromElement = document.getElementById(`${course.name}_mouseBox`);

    for (const prerequisite of course.prerequisites) {
        let toElement = document.getElementById(`${prerequisite}_courseContainer`);
        let offset_x = -175;
        let offset_y = -100;

        const cells = document.querySelectorAll("td"); // Get all table cells
        for (const cell of cells) {
            if (getTextContent(cell).includes(prerequisite)) {
                toElement = cell;
                offset_x = 0;
                offset_y = 0;
            }
        }

        if (toElement) {
            drawLine(fromElement, toElement, 'white', offset_x, offset_y);
        }
    }
}

const tableCells = document.querySelectorAll('td');
const courseCodeContainers = document.querySelectorAll('.courseCode'); // Select all elements wit

for (const [subject, offerings] of Object.entries(courses)) {
    for (const [offering, coursesArray] of Object.entries(offerings)) {
        for (const course of coursesArray) {

            const courseElement = document.getElementById(`${course.name}_courseContainer`);

            // MAIN ONCLICK FUNCTION
            courseElement.addEventListener('click', function (event) {
                
                // Check if the click target is inside any of the courseCodeContainers
                let isInsideCourseCodeContainer = false;
                courseCodeContainers.forEach(container => {
                    if (container.contains(event.target)) {
                        isInsideCourseCodeContainer = true;
                    }
                });

                if (!isInsideCourseCodeContainer) {
                    updateLinesFromMouseBox(course);
                    if (courseElement.classList.contains('used')) {return};

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
                        mouseBox.style.width = `90px`;
                        mouseBox.style.height = `70px`;
                    }
                    mouseBox.textContent = course.name;

                    // MouseBox modifiers
                    mouseBox.classList.add('mouseBox');
                    mouseBox.id = `${course.name}_mouseBox`;
                    if (course.honors) { mouseBox.classList.add('honors'); }
                    if (course.CONC) { mouseBox.classList.add('CONC'); }
                    if (course.advancedPlacement) { mouseBox.classList.add('advancedPlacement'); }
                    if (course.flex.length > 0) { newElement('div', `${course.name}_mouseBox`, 'flex', 'flexAppendage'); }

                    // FUNCTION THAT RUNS EVERY FRAME THAT MOUSEBOX IS BEING MOVED
                    function moveBox(e) {
                        mouseBox.style.position = 'absolute';
                        // Places mouse in center of mousebox
                        mouseBox.style.left = `${e.pageX - mouseBox.clientWidth/2}px`;
                        mouseBox.style.top = `${e.pageY - mouseBox.clientHeight/2}px`;

                        // Iterate through every cell for gaming purposes
                        tableCells.forEach(cell => {
                            [allowedSubjects, allowedGrades, isFlexSpot] = determineIfUnavailable(subject, course, cell);
                            if (!(allowedSubjects && allowedGrades)) {
                                cell.classList.add('unavailable');
                            }
                            if (!allowedSubjects && allowedGrades) {
                                cell.classList.add('semiUnavailable');
                            }
                        });
                        
                        updateLinesFromMouseBox(course);
                    }

                    function resetAvailability() {
                        tableCells.forEach(cell => cell.classList.remove('unavailable'));
                        tableCells.forEach(cell => cell.classList.remove('semiUnavailable'));
                    }

                    function handleDrop(e) {
                        svg.innerHTML = ''; // Clear existing lines
                        let elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);

                        [allowedSubjects, allowedGrades, isFlexSpot] = determineIfUnavailable(subject, course, elementUnderCursor);

                        // See if any prerequisite is not fulfilled
                        const fulfilledPrerequities = getFulfilledPrerequisites(elementUnderCursor, course.prerequisites, course.courseLength);
                        let allPrerequisitesFulfilled = !Object.values(fulfilledPrerequities).some(fulfilled => !fulfilled);

                        if (elementUnderCursor && elementUnderCursor.tagName === 'TD' && allowedGrades && allPrerequisitesFulfilled) {

                            // Handle previous class if it exists
                            if (elementUnderCursor.textContent) {
                                const previousClassName = getTextContent(elementUnderCursor);
                                const previousClassContainer = document.getElementById(`${previousClassName}_courseContainer`);
                                if (previousClassContainer) {
                                    previousClassContainer.classList.remove('used');
                                }
                            }
                    
                            // Place the new class
                            if (course.courseLength === 1) {
                                if (Number(elementUnderCursor.id[1]) % 2 === 0) {
                                    elementUnderCursor = elementUnderCursor.previousElementSibling;
                                }
                                const nextCell = elementUnderCursor.nextElementSibling;
                    
                                if (nextCell && nextCell.tagName === 'TD' && !nextCell.textContent) {
                                    elementUnderCursor.setAttribute('colspan', '2');
                                    nextCell.style.display = 'none';
                                    setCellModifiers(course, elementUnderCursor);
                                }
                            }
                            // If the course is a semester course and the cell under the cursor is empty
                            else if (!elementUnderCursor.textContent) {
                                setCellModifiers(course, elementUnderCursor);
                            }
                        }

                        evaluateCoursesInTable(true);
                        determineWhichEE();
                        cleanup();
                    }
                    
                    // General cleanup function
                    function cleanup() {
                        resetAvailability();
                        courseContainer.classList.remove('clicked');
                        document.removeEventListener('mousemove', moveBox);
                        document.removeEventListener('wheel', moveBox);
                        document.removeEventListener('mouseup', handleDrop);
                        mouseBox.remove();
                    }

                    document.addEventListener('mousemove', moveBox);
                    document.addEventListener('wheel', moveBox);
                    document.addEventListener('click', function handleClick(event) {
                        moveBox(event); // Trigger moveBox animation on click
                        resetAvailability(); // Clear unavailable cells
                        document.removeEventListener('click', handleClick); // Ensure resetAvailability only runs once
                    });
                    document.addEventListener('mouseup', handleDrop);
                }
            });
        }
    }
}

// Double-click listener to handle unmerging of cells
tableCells.forEach(cell => {
    cell.addEventListener('dblclick', function(event) {
        // Check if the double-clicked target is not an advanced flex bar
        if (!event.target.classList.contains('advancedBar')) {
            // THIS GOES RIGHT HERE DON'T MOVE IT EVER EVER EVER
            evaluateCoursesInTable(false);
            determineWhichEE();
            
            cell.classList.remove('occupied');
            cell.classList.remove('regular');
            cell.classList.remove('honors');
            cell.classList.remove('advancedPlacement');
            cell.classList.remove('CONC');
            cell.classList.remove('extraElective');

            courseContainer = document.querySelector(`[id="${getTextContent(cell)}_courseContainer"]`);
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
            // Evaluate flex spots again
            evaluateCoursesInTable(true);
            determineWhichEE();
        }
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
const flex = document.getElementById('flex');

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
flex.addEventListener('input', () => search());

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

                    // Determine if course is a flex course
                    const isFlex = (flex.checked && course.flex.length > 0) || (!flex.checked);

                    if (matchesName && matchesCredit && matchesGrades && matchesLevel && isFlex) {
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
function drawPathwayLines(pathways) {
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

                const ifAllPrerequisitesAreStats = course.prerequisites.every(stat => excludedPrerequisites.includes(stat))
                if ((course.prerequisites.length > 0 || course.postrequisites.length > 0) && !ifAllPrerequisitesAreStats) {

                    // Start a new pathway if the course is not discovered
                    if (!pathways[pathwayID]) {
                        // Apply random color
                        pathways[pathwayID] = { connections: [], color: `rgb(${getRandomInt(minColor, maxColor)}, ${getRandomInt(minColor, maxColor)}, ${getRandomInt(minColor, maxColor)})` };
                    }

                    let stack = [course.name]; // Theh stack is used to discover connected courses
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
                                if (algebra1Taken && currentCourseName == "PAP Algebra 1") {
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
    drawPathwayLines(pathways);
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

function setAlgebra1ToUsed() {
    if (!algebra1Taken) {
        document.getElementById(`PAP Algebra 1_courseContainer`).classList.add('used');
    }
    else {
        document.getElementById(`PAP Algebra 1_courseContainer`).classList.remove('used');
    }
    algebra1Taken = !algebra1Taken;

    // Do pathway stuff
    removeAllTiles();
    numOfPathways = generatePathways(specifiedPathwayID);
}