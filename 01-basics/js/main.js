
// INTIAL LIFECYCLE OF D3:
// 1. CREATION OF A SVG
// 2. FETCHING DATA
// 3. DATA CONVERSION TO INT TYPES, ETC.
// 4. ADD DATA TO TARGETED DOM NODES INSIDE SVG
// 5. PAINT DOM NODES INSIDE SVG


// CREATE SVG CONTAINER
const svg = d3.select('#chart-area')
.append('svg')
.attr('width', 800)
.attr('height', 600);


// FETCH DATA
Promise.all([
    d3.json('data/age.json'),
    d3.json('data/buildings.json')
]).then(result => {
    let [ageData, buildingData] = result;

    // CONVERT "age" STRING TO INT
    ageData.forEach(d => d.age = +d.age);

    // DROP AGE DATA INTO DOM NODES
    let circles = svg.selectAll('circle').data(ageData);

    // PAINT DOM NODES WITH AGE DATA
    circles.enter().append('circle')
        .attr('cx', (d, i) => (i * 50) + 25)
        .attr('cy', 25)
        .attr('r', d => d.age * 2)
        .attr('fill', d => {
            if (d.name === 'Tony') {
                return 'blue';
            }
            return 'red';
        });

    // CONVERT "height" STRING TO INT
    buildingData.forEach(d => d.height = +d.height);

    // DROP BUILDING DATA INTO DOM NODES
    let rectangles = svg.selectAll('rect').data(buildingData);

    // PAINT DOM NODES WITH BUILDING DATA
    rectangles.enter().append('rect')
        .attr('x', (d, i) => (i * 100))
        .attr('y', 100)
        .attr('width', 50)
        .attr('height', d => d.height)
        .attr('fill', d => {
            if (d.name === 'Shanghai Tower') {
                return 'green';
            }
            return 'grey';
        });
}).catch(err => {
    console.log(err);
});