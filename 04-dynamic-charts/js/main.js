
// GLOBALS
let xAxis
let yAxis
let xAxisGroup
let yAxisGroup

// SET CHART MARGINS
const margin = {
    bottom: 150,
    left: 100,
    right: 10,
    top: 10
}

// SET CHART WIDTH & HEIGHT
const width = 600 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

// SET HTML TARGET
const svg = d3.select('#chart-area')
              .append('svg')
              .attr('width', width + margin.left + margin.right)
              .attr('height', height + margin.top + margin.bottom)

// MOVES CHART
const g = svg.append('g')
             .attr('class', 'chart')
             .attr('transform',
                'translate(' + margin.left + ',' + margin.top + ')')

// CREATE TEXT LABELS
svg.append('text')
   .attr('class', 'x-axis-label')
   .attr('x', 315)
   .attr('y', 315)
   .attr('font-size', '20px')
   .text('Month')

svg.append('text')
   .attr('class', 'y-axis-label')
   .attr('x', -160)
   .attr('y', 40)
   .attr('font-size', '20px')
   .attr('transform', 'rotate(-90)')
   .text('Revenue')

// SHOW CATEGORIES ON X-AXIS
xAxisGroup = g.append('g')
              .attr('class', 'x-axis')
              .attr('transform', 'translate(0, ' + height + ')')
              .selectAll('text')
                  .attr('y', 10)
                  .attr('x', -5)

// SHOW CATEGORIES ON Y-AXIS
yAxisGroup = g.append('g')
              .attr('class', 'y-axis')

// UPDATE CHART
const update = data => {
    xAxis.domain(data.map(d => d.month))
    yAxis.domain([0, d3.max(data, d => d.revenue)])

    // SHOW CATEGORIES ON X-AXIS
    const xAxisCall = d3.axisBottom(xAxis)
    xAxisGroup.call(xAxisCall)

    // SHOW CATEGORIES ON Y-AXIS
    const yAxisCall = d3.axisLeft(yAxis)
                        .tickFormat(d => '$' + d)
    yAxisGroup.call(yAxisCall)

    // CREATE VISUALS ON CHART
    // const rectangles = g.selectAll('rect')
    //                     .data(data)
    //                     .enter()
    //                     .append('rect')
    //                     .attr('x', d => x(d.month))
    //                     .attr('y', d => y(d.revenue))
    //                     .attr('width', x.bandwidth)
    //                     .attr('height', d => height - y(d.revenue))
    //                     .attr('fill', d => color(d.month))
}

// CREATE CHART
Promise.all([
    d3.json('data/revenues.json')
]).then(result => {
    // ASSIGN INCOMING DATA
    const [data] = result

    // DATA CONVERSION FOR INTEGERS
    data.forEach(d => d.revenue = +d.revenue)
    data.forEach(d => d.profit = +d.profit)

    // ASSIGNS A COLOR TO CATEGORIES
    const color = d3.scaleOrdinal()
                    .domain(data.map(d => d.month))
                    .range(d3.schemeCategory10)

    // CREATE BOUNDARIES ON X-AXIS
    xAxis = d3.scaleBand()
                .domain(data.map(d => d.month))
                .range([0, width])
                .paddingInner(0.3)
                .paddingOuter(0.3)

    // CREATE BOUNDARIES ON Y-AXIS
    yAxis = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.revenue)])
                    .range([height, 0])

    d3.interval(() => update(data), 1000)

    // RUN THE VISUAL FOR THE FIRST TIME BEFORE LOOP BEGINS
    update(data)
}).catch(err => {
    console.log(err)
})