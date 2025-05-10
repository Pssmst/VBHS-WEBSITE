// This makes those little circles that say "19+ ACT" that look really wonky sometimes
function createPrerequisiteStat(course, titleText, statText, order) {
    newElement('div', `${course.name}_courseContainer`, titleText, 'preTitle', 'prerequisiteStat', order);
    newElement('div', `${course.name}_courseContainer`, statText, 'preNumber', 'prerequisiteStat', order);
}

// Toggle-based function to collapse subjects
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

// Creates the master class panel on the right-hand side of the screen and populates it with all classes
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

            // Creates the little colored circles to the left of each course. This sucks but whatever lmao
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

// SEARCH BAR //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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