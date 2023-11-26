// Set up SVG container
const svg = d3.select("#graph-container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .call(d3.zoom().on("zoom", () => {
        svg.attr("transform", d3.event.transform);
    }))
    .append("g");

let centerX = window.innerWidth / 2;
let centerY = window.innerHeight / 2;

// Set up red dot at the center
const mainPoint = svg.append("circle")
    .attr("cx", centerX)
    .attr("cy", centerY)
    .attr("r", 5)
    .style("fill", "red");

// Array to store generated map points
const mapPoints = [];
mapPoints.push({ x: centerX, y: centerY, serial: 0, degree: 0, steps: 0 });
let serialNumber = 1; // Initialize serial number count
let showPoints = 1;
// Function to generate map based on degree and steps

function generateMap() {
    // Get inputs
    const degree = parseFloat(document.getElementById("degreeInput").value) || 0;
    const steps = parseInt(document.getElementById("stepsInput").value) || 0;

    // Your logic for calculating map coordinates based on degree and steps
    // This is a placeholder, replace it with your actual calculation
    const mapX = centerX + steps * Math.cos((degree - 90) * (Math.PI / 180));
    const mapY = centerY + steps * Math.sin((degree - 90) * (Math.PI / 180));

    // Display the map point with serial number, degree, and steps
    const mapPoint = { x: mapX, y: mapY, serial: serialNumber, degree: degree, steps: steps };

    // Update the position of the main point to the latest map point
    centerX = mapX;
    centerY = mapY;

    mainPoint.attr("cx", centerX).attr("cy", centerY);

    mapPoints.push(mapPoint);

    svg.selectAll(".map-point")
        .data(mapPoints)
        .enter()
        .append("circle")
        .attr("class", "map-point")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 5)
        .style("fill", "blue");

    // Display serial number text
    svg.selectAll(".serial-number")
        .data(mapPoints)
        .enter()
        .append("text")
        .attr("class", "serial-number")
        .attr("x", d => d.x - 5)
        .attr("y", d => d.y + 5)
        .text(d => d.serial)
        .attr("fill", "black");

    // Display degree and steps values
    const pointInfo = svg.selectAll(".point-info")
        .data(mapPoints)
        .enter()
        .append("text")
        .attr("class", "point-info")
        .attr("x", d => d.x + 8)
        .attr("y", d => d.y + 15)
        .text(d => `(${d.degree}°,${d.steps})`)
        .attr("fill", "black");

    // Hide point-info text if input fields are hidden
    const inputFields = document.getElementById("inputFields");
    if (inputFields.classList.contains("hidden")) {
        pointInfo.style("display", "none");
    }

    // Clear input values for the next entry
    document.getElementById("degreeInput").value = "";
    document.getElementById("stepsInput").value = "";

    // Increment serial number for the next point
    serialNumber++;
}

// Handle Enter key press to trigger generateMap()
function handleKeyPress(event, nextInputId) {
    if (event.key === "Enter") {
        generateMap();
        event.preventDefault(); // Prevent the default Enter key behavior
        document.getElementById(nextInputId).focus(); // Move focus to the next input
    }
}

// Toggle visibility of input fields
function toggleInput() {

    //const inputFields = document.getElementById("inputFields");
    //inputFields.classList.toggle("hidden");

    // Show or hide point-info text based on input fields visibility
    const pointInfo = svg.selectAll(".point-info");
    if (showPoints == 1) {
        pointInfo.style("display", "none");
        showPoints = 0;
    } else {
        pointInfo.style("display", "block");
        showPoints = 1;
    }
}
function handleKeyPress(event, nextInputId) {
    if (event.key === "Enter") {
        generateMap();
        event.preventDefault(); // Prevent the default Enter key behavior
        document.getElementById("degreeInput").focus(); // Move focus to the next input
    }
}
function getall() {
    const inputs = String(document.getElementById("allInputs").value);
    const values = inputs.split(',').map(value => value.trim());

    const degrees = [];
    const steps = [];

    for (let i = 0; i < values.length; i += 2) {
        const degree = parseFloat(values[i]);
        const step = parseInt(values[i + 1]);

        if (!isNaN(degree) && !isNaN(step)) {
            degrees.push(degree);
            steps.push(step);
        }
    }

    return { degrees, steps };
}


function generateAllMap() {
    const { degrees, steps } = getall();
    for (let i = 0; i < degrees.length; i++) {

        const mapX = centerX + steps[i] * Math.cos((degrees[i] - 90) * (Math.PI / 180));
        const mapY = centerY + steps[i] * Math.sin((degrees[i] - 90) * (Math.PI / 180));

        // Display the map point with serial number, degree, and steps
        const mapPoint = { x: mapX, y: mapY, serial: serialNumber, degree: degrees[i], steps: steps[i] };

        // Update the position of the main point to the latest map point
        centerX = mapX;
        centerY = mapY;

        mainPoint.attr("cx", centerX).attr("cy", centerY);

        mapPoints.push(mapPoint);

        svg.selectAll(".map-point")
            .data(mapPoints)
            .enter()
            .append("circle")
            .attr("class", "map-point")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 5)
            .style("fill", "blue");

        // Display serial number text
        svg.selectAll(".serial-number")
            .data(mapPoints)
            .enter()
            .append("text")
            .attr("class", "serial-number")
            .attr("x", d => d.x - 5)
            .attr("y", d => d.y + 5)
            .text(d => d.serial)
            .attr("fill", "black");

        // Display degree and steps values
        const pointInfo = svg.selectAll(".point-info")
            .data(mapPoints)
            .enter()
            .append("text")
            .attr("class", "point-info")
            .attr("x", d => d.x + 8)
            .attr("y", d => d.y + 15)
            .text(d => `(${d.degree}°,${d.steps})`)
            .attr("fill", "black");

        // Hide point-info text if input fields are hidden
        const inputFields = document.getElementById("inputFields");
        if (inputFields.classList.contains("hidden")) {
            pointInfo.style("display", "none");
        }

        // Clear input values for the next entry
        document.getElementById("degreeInput").value = "";
        document.getElementById("stepsInput").value = "";

        // Increment serial number for the next point
        serialNumber++;
    }

}