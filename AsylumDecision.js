
const AsylumDecisionURL = "https://script.google.com/macros/s/AKfycbytQHIRHVuI9dQugwZ8ZPpDpF4L_dDjKbq1gtAk8NWNgsXOS-x3/exec?topic=AsylumDecisions"

fetch(AsylumDecisionURL).then(response => 
    response.json().then(data => ({
        data: data,
        status: response.status
    })
    ).then(res => {
        makeGraphs(res.data)
    })
);

function makeGraphs(data) {
    data = dataConversion(data)
    // AsylumDescisionPerYearBarChart(data)
    // AsylumDescisionPerYearLineChart(data)
    AsymlumDecisionHeatMap(data)
    // test(data)
    // dc.renderAll();
}

function dataConversion(data) {
    var cleanData = []
    for(let d in data) {
        var ageRangeObj  = {}
        var sortedKeys = Object.keys(data[d]).reverse();
        for(let v in sortedKeys) {
            var n = sortedKeys[v]
            if(Object.keys(ageRangeObj).length === 4 || Object.keys(ageRangeObj).length > 4){
                ageRangeObj['year'] = n
                ageRangeObj['count'] = data[d][n]
                var dataPerYear = JSON.stringify(ageRangeObj)
                cleanData.push(JSON.parse(dataPerYear))
            } else {
                ageRangeObj[n] = data[d][n]
            }
        }
    }
    return cleanData
}

function AsylumDescisionPerYearBarChart(CountryData) {
    var ndx = crossfilter(CountryData)
    var countryDim = ndx.dimension(dc.pluck("year"));
    var countryMix = countryDim.group().reduceSum(dc.pluck("count"))
    dc.barChart("#AsylumDescisionPerYear")
        .width(1550)
        .height(550)
        .margins({top: 20, right: 50, bottom: 100, left: 80})
        .dimension(countryDim)
        .group(countryMix)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Year")
        .yAxisLabel("Total descisions made on Asylum Applications")
        .yAxis().ticks(20);
}

function AsylumDescisionPerYearLineChart(data) {
    var ndx = crossfilter(data)
    var yearDim = ndx.dimension(dc.pluck("year"));
    var yearGroup = yearDim.group().reduceSum(dc.pluck("count"))
    var chart = dc.lineChart("#AsylumDescisionLine")
        .width(1800)
        .height(500)
        .margins({top: 20, right: 50, bottom: 100, left: 80})
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .brushOn(false)
        .xAxisLabel('Year')
        .yAxisLabel('Total descisions made on Asylum Applications')
        .dimension(yearDim)
        .group(yearGroup)
}

function AsymlumDecisionHeatMap(data) {
    var ndx    = crossfilter(data),
        runDim = ndx.dimension(function(d) {return [d.country, d.year]; }),
        runGroup = runDim.group().reduceSum(function(d) { return d.count });
    var chart = dc.heatMap("#AsylumDescisionHeatMap")
        .width(2000)
        .height(500)
        .margins({top: 20, right: 50, bottom: 100, left: 50})
        .dimension(runDim)
        .group(runGroup)
        .keyAccessor(function(d) {
            return d.key[0]; })
        .valueAccessor(function(d) { return d.key[1]; })
        .colorAccessor(function(d) { return +d.value; })
        .title(function(d) {
            return "Country:   " + d.key[0] + "\n" +
                "Year:  " + d.key[1] + "\n" +
                "Count: " + d.value})
        .colors(["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"])
        .calculateColorDomain();

    chart.render();
    chart.selectAll('g.cols.axis > text')
                .attr('transform', function (d) {
                    var coord = this.getBBox();
                    var x = coord.x + (coord.width/2),
                        y = coord.y + (coord.height/2);
                    return "rotate(-30 "+x+" "+y+")"
                    })
                .attr("font-size", "30px")
    }

function test(data) {
    countries = []
    data.forEach(d => {if(!(countries.includes(d.country))) {
                            countries.push(d.country)}})
    var chart = dc.barChart("#test");
    var ndx                 = crossfilter(data),
        runDimension        = ndx.dimension(dc.pluck("country")),
        speedSumGroup       = runDimension.group().reduce(function(p, v) {
            p[v.year] = (p[v.year] || 0) + v.count;
            return p;
        }, function(p, v) {
            p[v.year] = (p[v.year] || 0) - v.count;
            return p;
        }, function() {
            return {};
        });
    function sel_stack(i) {
        return function(d) {
            return d.value[i];
        };
    }
    console.log(countries)
    chart
        .width(1800)
        .height(500)
        .x(d3.scale.ordinal()
            .domain(countries))
        .brushOn(false)
        .clipPadding(10)
        .title(function(d) {
            return d.key + '[' + this.layer + ']: ' + d.value[this.layer];
        })
        .dimension(runDimension)
        .group(speedSumGroup,'2013', sel_stack('2013'))
        .renderLabel(true);

    chart.legend(dc.legend());
    dc.override(chart, 'legendables', function() {
        var items = chart._legendables();
        return items.reverse();
    });
    for(var i = 2014; i<2019; ++i)
        chart.stack(speedSumGroup, ''+i, sel_stack(i));

}