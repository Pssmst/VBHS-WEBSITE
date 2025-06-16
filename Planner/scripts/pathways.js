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

            if (fromElem && toElem) {
                drawLine(fromElem, fromElem.clientWidth/2, 0, toElem, -toElem.clientWidth/2, 0, pathway.color);
            }
        });
    });
}

window.addEventListener("resize", function() {
    generatePathways(specifiedPathwayID);
});

// This is the big one
function generatePathways(specifiedPathwayID) {
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
                        pathways[pathwayID] = { connections: [], color: `rgb(
                            ${Math.floor(Math.random() * (maxColor - minColor + 1)) + minColor},
                            ${Math.floor(Math.random() * (maxColor - minColor + 1)) + minColor},
                            ${Math.floor(Math.random() * (maxColor - minColor + 1)) + minColor}
                        )` };
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
                        try {
                            for (const prerequisite of currentCourse.prerequisites) {
                                if (!excludedPrerequisites.includes(prerequisite)) { // Gotta make sure to excldue the stat prerequisites :(
                                    pathways[pathwayID].connections.push({ from: prerequisite, to: currentCourseName });
                                    stack.push(prerequisite); // Add to stack to discover connected courses
                                }
                            }
                        }
                        catch (e) {
                            console.log(currentCourseName);
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
