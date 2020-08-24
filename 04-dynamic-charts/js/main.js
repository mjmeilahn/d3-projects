
const margin = { left:80, right:20, top:50, bottom:100 }

const width = 600 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const g = d3.select('#chart-area')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')

const xAxisGroup = g.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + height +')')

const yAxisGroup = g.append('g')
                    .attr('class', 'y axis')

// X Scale
const x = d3.scaleBand()
            .range([0, width])
            .padding(0.2)

// Y Scale
const y = d3.scaleLinear()
            .range([height, 0])

// X Label
g.append('text')
 .attr('y', height + 50)
 .attr('x', width / 2)
 .attr('font-size', '20px')
 .attr('text-anchor', 'middle')
 .text('Month')

// Y Label
g.append('text')
 .attr('y', -60)
 .attr('x', -(height / 2))
 .attr('font-size', '20px')
 .attr('text-anchor', 'middle')
 .attr('transform', 'rotate(-90)')
 .text('Revenue')

d3.json('data/revenues.json').then(data => {
    // Clean data
    data.forEach(d => d.revenue = +d.revenue)
    data.forEach(d => d.profit = +d.profit)

    d3.interval(() => update(data), 1000)

    // Run the visual for the first time
    update(data)
})

const update = data => {
    x.domain(data.map(d => d.month))
    y.domain([0, d3.max(data, d => d.revenue)])

    // X Axis
    const xAxisCall = d3.axisBottom(x)
    xAxisGroup.call(xAxisCall)

    // Y Axis
    const yAxisCall = d3.axisLeft(y)
                        .tickFormat(d => '$' + d)
    yAxisGroup.call(yAxisCall)

    // JOIN new data with old elements.
    const rects = g.selectAll('rect')
                   .data(data)

    // EXIT old elements not present in new data.
    rects.exit().remove()

    // UPDATE old elements present in new data.
    rects
        .attr('y', d => y(d.revenue))
        .attr('x', d => x(d.month))
        .attr('height', d => height - y(d.revenue))
        .attr('width', x.bandwidth)

    // ENTER new elements present in new data.
    rects.enter()
         .append('rect')
            .attr('y', d => y(d.revenue))
            .attr('x', d => x(d.month))
            .attr('height', d => height - y(d.revenue))
            .attr('width', x.bandwidth)
            .attr('fill', 'grey')
}