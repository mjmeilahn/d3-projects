
// INTIAL LIFECYCLE OF D3:
// 1. CREATION OF A SVG
// 2. FETCHING DATA
// 3. DATA CONVERSION TO INT TYPES, ETC.
// 4. ADD DATA TO TARGETED DOM NODES INSIDE SVG
// 5. PAINT DOM NODES INSIDE SVG

// TYPES:
// 1. svg
// 2. rect
// 3. circle
// 4. ellipse
// 5. line
// 6. text
// 7. path

// D3 METHODS:
// .select()         ----> .querySelector()
// .selectAll()      ----> .querySelectorAll()


// CREATE SVG CONTAINER
const svg = d3.select('#chart-area')
              .append('svg')
              .attr('width', 400)
              .attr('height', 600)


// FETCH DATA
Promise.all([
    d3.json('data/age.json'),
    d3.json('data/buildings.json')
]).then(result => {
    let [ageData, buildingData] = result

    // CONVERT "age" STRING TO INT
    ageData.forEach(d => d.age = +d.age)

    // DROP AGE DATA INTO DOM NODES
    let circles = svg.selectAll('circle').data(ageData)

    // PAINT DOM NODES WITH AGE DATA
    circles.enter()
           .append('circle')
           .attr('cx', (d, i) => (i * 50) + 25)
           .attr('cy', 25)
           .attr('r', d => d.age * 2)
           .attr('fill', d => {
               if (d.name === 'Tony') {
                   return 'blue'
               }
               return 'red'
           })

    // CONVERT "height" STRING TO INT
    buildingData.forEach(d => d.height = +d.height)

    // CREATE ARRAY OF BUILDING NAMES
    let buildingNames = []
    buildingData.map(obj => buildingNames.push(obj.name))

    // SCALE WITHIN A RANGE
    // THERE ARE MANY TYPES OF SCALES
    // 1. Linear - d3.scaleLinear()
    // 2. Log - d3.scaleLog()
    // 3. Time - d3.scaleTime() takes a JS Date Object in domain
    // 4. Band - d3.scaleBand()
    // 5. Ordinal - d3.scaleOrdinal()
    //                .domain(["Africa", "N. America", "Europe"])
    //                .range(d3.schemeCategory10)

    let x = d3.scaleBand()
              .domain(buildingNames)
              .range([0, 400])
              .paddingInner(0.3)
              .paddingOuter(0.3)

    let y = d3.scaleLinear()
              .domain([0, 828])
              .range([0, 400])

    // DROP BUILDING DATA INTO DOM NODES
    let rectangles = svg.selectAll('rect').data(buildingData)

    // PAINT DOM NODES WITH BUILDING DATA
    rectangles.enter()
              .append('rect')
              .attr('x', d => x(d.name))
              .attr('y', 100)
              .attr('width', x.bandwidth)
              .attr('height', d => y(d.height))
              .attr('fill', d => {
                  if (d.name === 'Shanghai Tower') {
                      return 'green'
                  }
                  return 'grey'
              })
}).catch(err => {
    console.log(err)
})