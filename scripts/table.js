// Takes a cell of the course table and returns the text content of the leftmost cell (the subject name, like "English")
function getLeftmostTH(elementUnderCursor) {
    // Ensure elementUnderCursor exists and is a table cell (TD or TH)
    if (elementUnderCursor && (elementUnderCursor.tagName === 'TD' || elementUnderCursor.tagName === 'TH')) {
        const row = elementUnderCursor.parentElement;
        const leftmostCell = row.querySelector('td, th'); // Selects the first TD or TH in the row
        return leftmostCell ? leftmostCell.textContent : null;
    }
    return null;
}

// Gets the PURE text content of an element without any code that is nested inside the string
function getTextContent(cell) {
    // Get only text nodes (ignores child elements)
    const textContent = Array.from(cell.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE)
    .map(node => node.textContent.trim())
    .join(' ');
    return textContent;
}

let algebra1Taken = false;

// Returns every prerequisite that is fulfilled (placed before the course) for a course that is about to be placed on the table
// A course will only be able to be placed on the table if this function returns ALL of the course's prerequisites
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
 
// Look at a cell and determines if it should be unavailable
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
// Modifiers are the things that make the inside of the cell have cool gradient colors (or just purple)
function setCellModifiers(course, elementUnderCursor) {
    elementUnderCursor.textContent = course.name;
    elementUnderCursor.classList.add('occupied');

    if (course.honors)            { elementUnderCursor.classList.add('honors'); }
    if (course.advancedPlacement) { elementUnderCursor.classList.add('advancedPlacement'); }
    if (course.CONC)              { elementUnderCursor.classList.add('CONC'); }

    if (!course.honors && !course.advancedPlacement && !course.CONC) { elementUnderCursor.classList.add('regular'); }
}

// FLEX COURSES ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// HERE IS THE PROBLEM!
// This is a DICTIONARY. For some reason, later in the code, I refer to this as a 2D array
// Please look at this over again. The improper indexing of this is causing the multi-choice flex bars to not work
let advancedFlexbars = {};

// Applies and removes the flexCourseSpot modifier on cells
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

// Scans all cells for a variety of properties
function evaluateCoursesInTable(ifAdd) {
    let coursesInTable = [];

    // Takes the pure text content of each cell in the table and gives its respective div in the courses panel the "used" class
    // TODO: This needs to be modified for classes that you can place multiple times
    tableCells.forEach(cell => {
        if (courseMap.get(getTextContent(cell))) {
            coursesInTable.push([courseMap.get(getTextContent(cell)), cell.id]);
        }
        const courseContainer = document.getElementById(`${getTextContent(cell)}_courseContainer`);
        if (courseContainer) { courseContainer.classList.add('used'); }
    });

    // Finds flex courses in the table and determine what spots are available for extra electives for each flex course
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

// Determines which extra electives are available through flex classes and which ones are not recommended (a red "EE")
function determineWhichEE() {
    const flexCourseIndicators = document.querySelectorAll('.flexCourseIndicator');
    flexCourseIndicators.forEach(element => {
        element.remove();
    });

    // Iterates through every cell and determines whether it's an EE given by a flex course or an EE that is from a plain unavailable cell
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

            // Flex course indicator (small top-left yellow indicator)
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
                if (event.target && event.target.classList.contains('advancedBar') && advancedFlexbars[cell.id][0]) {
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

// MOUSE BOX ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateLinesFromMouseBox(course) {
    svg.innerHTML = ''; // Clear existing lines
    const fromElement = document.getElementById(`${course.name}_mouseBox`);

    for (const prerequisite of course.prerequisites) {
        let toElement = document.getElementById(`${prerequisite}_courseContainer`);
        let xOffset = -175;
        let yOffset = -100;

        const cells = document.querySelectorAll("td"); // Get all table cells
        for (const cell of cells) {
            if (getTextContent(cell).includes(prerequisite)) {
                toElement = cell;
                xOffset = 0;
                yOffset = 0;
            }
        }

        if (toElement) {
            drawLine(fromElement, 0, 0, toElement, xOffset, yOffset, 'white');
        }
    }
}

const tableCells = document.querySelectorAll('td');
const courseCodeContainers = document.querySelectorAll('.courseCode');

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

                    document.body.classList.add("grabbing");

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

                    // FUNCTION THAT RUNS EVERY FRAME THAT MOUSEBOX IS BEING MOVED AND ALSO ONCE ON-CLICK
                    function moveBox(e) {
                        mouseBox.style.position = 'absolute';

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
                        document.body.classList.remove("grabbing");
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

        if (!event.target.classList.contains('advancedBar')) { // If the double-clicked cell does NOT contain an advanced flex bar

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