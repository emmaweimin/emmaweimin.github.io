d3.csv("./data/missouri.csv").then(function(data) {

    const width = 1350;
    const height = 825;
    const margin = {top: 50, left: 125, right: 50, bottom: 110};

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width+220)
        .attr("height", height+200);


    const missouri = data.filter(function(d) {
        return d.city == "Affton" , "Berkley", "Breckenridge Hills", "Brentwood", "Clayton", "Creve Coeur", "Des Peres", "Ferguson", "Frontenac", "Jennings", "Kinloch", "Kirkwood", "Lemay", "Maplewood", "Normandy", "North County", "Olivette", "Overland", "Richmond Heights", "University City", "Webster Groves", "Sappington", "St. Louis";
    });


    console.log(missouri);


    const computer = {
        min: d3.min(missouri, function(d) { return +d.computer; }),
        max: d3.max(missouri, function(d) { return +d.computer; })
    };
    const transit = {
        min: d3.min(missouri, function(d) { return +d.transit; }),
        max: d3.max(missouri, function(d) { return +d.transit; })
    };
    const pop = {
        min: d3.min(missouri, function(d) { return +d.pop; }),
        max: d3.max(missouri, function(d) { return +d.pop; })
    };


    const xScale = d3.scaleLinear()
        .domain([transit.min, transit.max])
        .range([margin.left, width-margin.right]);
    const yScale = d3.scaleLinear()
        .domain([computer.min, computer.max])
        .range([height-margin.bottom, margin.top]);
    const rScale = d3.scaleSqrt()
        .domain([pop.min, pop.max])
        .range([3, 25]);
    var colorScale = d3.scaleOrdinal()
        .range(["#af146f", "#17528a"]);


    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));
    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));


    const circle = svg.selectAll("circle")
        .data(missouri)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.transit); })
            .attr("cy", function(d) { return yScale(d.computer); })
            .attr("r", function(d) { return rScale(d.pop); })
            .attr("fill", function(d) { return colorScale(d.race); });


    const xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2.4)
        .attr("y", height-margin.bottom/2+25)
        .text("Public Transportation Commute to Work");
    const yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("transform","rotate(-90)")
        .attr("x",-height/1.7)
        .attr("y",margin.left/8)
        .text("Access to a Personal Computer");


    const tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");
    circle.on("mouseover", function(e, d) {
    console.log(d);
    let cx = +d3.select(this).attr("cx")+30;
    let cy = +d3.select(this).attr("cy")-105;
    tooltip.style("visibility", "visible")
        .style("left", `${cx}px`)
        .style("top", `${cy}px`)
        .html(`<b>Area:</b> ${d.city}<br><b>Population:</b> ${d.pop}<br><b>Public Transportation Commute to Work:</b> ${d.transit}<br><b>Owns a Personal Computer:</b> ${d.computer}`);
    d3.select(this)
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 15);
    }).on("mouseout", function() {
    tooltip.style("visibility", "hidden");
    d3.select(this)
        .attr("stroke", "none")
        .attr("stroke-width", 0);
    });


    d3.selectAll(".race").on("input", function() {
        let race = d3.select(this).property("value");
        let isChecked = d3.select(this).property("checked");
        console.log(race, isChecked);
        let selection = circle.filter(function(d) {
            return d.race == race;
        });

        if(isChecked == true) {
            selection.attr("opacity", 1)
                .attr("pointer-events", "all");
        } else {
            selection.attr("opacity", 0)
                .attr("pointer-events", "none");
        }
    });
});