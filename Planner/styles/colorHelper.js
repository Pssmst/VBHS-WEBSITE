// This function runs on page load, so the new variables are available immediately

function convertToOpacity(rootVariableName, newVariableName, opacity) {
    // 0) Check if the root variable is set
    const root = document.documentElement;

    // 1) Read the base rgb() value
    let rgbText = getComputedStyle(root)
        .getPropertyValue(rootVariableName)
        .trim();
    if (!rgbText) return;

    // 2) Extract channels
    let channels = rgbText.match(/\d+/g);
    if (!channels || channels.length < 3) return;
    let [r, g, b] = channels.map(Number);

    // 3) Write the new RGBA var
    root.style.setProperty(newVariableName,`rgba(${r/opacity}, ${g/opacity}, ${b/opacity}, ${opacity})`);
}

function rgbToVanillaValues(rootVariableName, newVariableName) {
    // 0) Check if the root variable is set
    const root = document.documentElement;

    // 1) Read the base rgb() value
    let rgbText = getComputedStyle(root)
        .getPropertyValue(rootVariableName)
        .trim();
    if (!rgbText) return;

    // 2) Extract channels
    let channels = rgbText.match(/\d+/g);
    if (!channels || channels.length < 3) return;
    let [r, g, b] = channels.map(Number);

    // 3) Write the new RGBA var
    root.style.setProperty(newVariableName,`${r}, ${g}, ${b}`);
}

// CUSTOMIZE VARIABLES TO BE CREATED HERE
(function() {
    rgbToVanillaValues('--color-gold', '--colorN-gold');

    convertToOpacity('--color-regular-outline-bright', '--color-regular-outline-bright-mousebox', .6);
    convertToOpacity('--color-regular-background-bright', '--color-regular-background-bright-mousebox', .6);

    convertToOpacity('--color-honors-outline-bright', '--color-honors-outline-bright-mousebox', .6);
    convertToOpacity('--color-honors-background-bright','--color-honors-background-bright-mousebox', .6);

    convertToOpacity('--color-conc-background-left', '--color-conc-background-left-mousebox', .7);
    convertToOpacity('--color-conc-background-right', '--color-conc-background-right-mousebox', .7);

    convertToOpacity('--color-ap-background-left', '--color-ap-background-left-mousebox', .7);
    convertToOpacity('--color-ap-background-right', '--color-ap-background-right-mousebox', .7);
})();
