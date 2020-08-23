
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

// D3 SELECTOR METHODS:
// .select()         ----> .querySelector()
// .selectAll()      ----> .querySelectorAll()

// SCALE WITHIN A RANGE
// THERE ARE MANY TYPES OF SCALES
// 1. LINEAR - ideal for linear data sets
//          d3.scaleLinear()
// 2. LOG - ideal for exponential data sets
//          d3.scaleLog()
// 3. TIME - takes a JS Date Object in domain
//          d3.scaletime()
//            .domain(
//                [new Date(2000, 0, 1), new Date(2001, 0, 1)
//            )
// 4. BAND - Used mainly for bar charts
//           d3.scaleBand()
// 5. ORDINAL - ideal for assigning a color to a category
//              d3.scaleOrdinal()
//                .domain(["Africa", "N. America", "Europe"])
//                .range(d3.schemeCategory10)

// .invert() CAN SCALE "x" OR "y" VALUE BACK TO ORIGINAL

// CREATE MARGINS
const margin = {
    bottom: 150,
    left: 100,
    right: 10,
    top: 10
}

const width = 600 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

// CREATE SVG CONTAINER
const svg = d3.select('#chart-area')
              .append('svg')
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom)

// CREATE TEXT LABELS
svg.append('text')
   .attr('class', 'x-axis-label')
   .attr('x', width / 2)
   .attr('y', height + 140)
   .attr('font-size', '20px')
   .text('The World\'s Tallest Buildings')

svg.append('text')
   .attr('class', 'y-axis-label')
   .attr('x', -160)
   .attr('y', 50)
   .attr('font-size', '20px')
   .attr('transform', 'rotate(-90)')
   .text('Height (m)')


// FETCH DATA
Promise.all([
    d3.json('data/buildings.json')
]).then(result => {
    const [data] = result

    // CONVERT "height" STRING TO INT
    data.forEach(d => d.height = +d.height)

    // CREATE ARRAY OF BUILDING NAMES
    const names = []
    data.map(d => names.push(d.name))

    const g = svg.append('g')
                 .attr('transform',
                     'translate(' + margin.left + ',' + margin.top + ')')

    const color = d3.scaleOrdinal()
                    .domain(names)
                    .range(d3.schemeCategory10)

    const x = d3.scaleBand()
              .domain(names)
              .range([0, width])
              .paddingInner(0.3)
              .paddingOuter(0.3)

    const y = d3.scaleLinear()
              .domain([0, d3.max(data, d => d.height)])
              .range([height, 0])

    const xAxisCall = d3.axisBottom(x)
    g.append('g')
     .attr('class', 'x-axis')
     .attr('transform', 'translate(0, ' + height + ')')
     .call(xAxisCall)
     .selectAll('text')
        .attr('y', 10)
        .attr('x', -5)
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-40)')

    const yAxisCall = d3.axisLeft(y)
                      .ticks(4)
                      .tickFormat(d => d + 'm')

     g.append('g')
      .attr('class', 'y-axis')
      .call(yAxisCall)

    // DROP BUILDING DATA INTO DOM NODES
    const rectangles = g.selectAll('rect').data(data)

    // PAINT DOM NODES WITH BUILDING DATA
    rectangles.enter()
              .append('rect')
              .attr('x', d => x(d.name))
              .attr('y', d => y(d.height))
              .attr('width', x.bandwidth)
              .attr('height', d => height - y(d.height))
              .attr('fill', d => color(d.name))
}).catch(err => {
    console.log(err)
})