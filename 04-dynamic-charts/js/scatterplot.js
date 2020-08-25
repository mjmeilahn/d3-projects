
const margin = { left:80, right:20, top:50, bottom:100 }

const width = 600 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const g = d3.select('#chart-area')
            .append('svg')
            .attr('class', 'chart')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')

const xAxisGroup = g.append('g')
                    .attr('class', 'x-axis')
                    .attr('transform', 'translate(0,' + height +')')

const yAxisGroup = g.append('g')
                    .attr('class', 'y-axis')

// X Scale
const x = d3.scaleBand()
            .range([0, width])
            .padding(0.2)

// Y Scale
const y = d3.scaleLinear()
            .range([height, 0])

// X Label
const xLabel = g.append('text')
                .attr('y', height + 50)
                .attr('x', width / 2)
                .attr('font-size', '20px')
                .attr('text-anchor', 'middle')
                .text('Month')

// Y Label
let yLabel = g.append('text')
              .attr('y', -60)
              .attr('x', -(height / 2))
              .attr('font-size', '20px')
              .attr('text-anchor', 'middle')
              .attr('transform', 'rotate(-90)')
              .text('Revenue')

let flag = false
let t = d3.transition().duration(750)

d3.json('data/revenues.json').then(data => {
    // Clean data
    data.forEach(d => d.revenue = +d.revenue)
    data.forEach(d => d.profit = +d.profit)

    d3.interval(() => {
        let newData = flag ? data : data.slice(1)

        update(newData)
        flag = !flag
    }, 1000)

    // Run the visual for the first time
    update(data)
})

const update = data => {
    let value = flag ? 'revenue' : 'profit'

    x.domain(data.map(d => d.month))
    y.domain([0, d3.max(data, d => d.revenue)])

    // X Axis
    const xAxisCall = d3.axisBottom(x)
    xAxisGroup.transition(t).call(xAxisCall)

    // Y Axis
    const yAxisCall = d3.axisLeft(y)
                        .tickFormat(d => '$' + d)
    yAxisGroup.transition(t).call(yAxisCall)

    // JOIN new data with old elements.
    const circles = g.selectAll('circle')
                     .data(data, d => d.month)

    // EXIT old elements not present in new data.
    circles
        .exit()
        .attr('fill', 'red')
        .transition(t)
        .attr('cy', y(0))
        .remove()

    // UPDATE old elements present in new data.
    // circles
    //     .transition(t)
    //     .attr('cy', d => y(d[value])) // used to be d.revenue
    //     .attr('cx', d => x(d.month))
    //     .attr('height', d => height - y(d[value])) // used to be d.revenue

    // ENTER new elements present in new data.
    circles.enter()
           .append('circle')
           .attr('fill', 'grey')
           .attr('cx', d => x(d.month) + x.bandwidth() / 2)
           .attr('cy', y(0))
           .attr('r', 5)
           // AND UPDATE old elements present in new data
           .merge(circles)
           .transition(t)
           .attr('cx', d => x(d.month) + x.bandwidth() / 2)
           .attr('cy', d => y(d[value])) // used to be d.revenue

    let label = flag ? 'Revenue' : 'Profit'
    yLabel.text(label)
}