
const url = "https://script.google.com/macros/s/AKfycbytQHIRHVuI9dQugwZ8ZPpDpF4L_dDjKbq1gtAk8NWNgsXOS-x3/exec?topic=AsylumDecisions"

fetch(url).then(response => 
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
    AsylumDescisionPerYearBarChart(data)
    AsylumDescisionPerYearLineChart(data)
    dc.renderAll();
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

function AsylumDescisionPerYearLineChart(data) {
    var ndx = crossfilter(data)
    var dateDim = ndx.dimension(dc.pluck("year"));
    var sentiGroup = dateDim.group().reduceSum(dc.pluck("count"));
    var chart = dc.lineChart("#AsylumDescisionLine")
        .width(1800)
        .height(500)
        .margins({top: 10, right: 50, bottom: 50, left: 50})
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .brushOn(false)
        .xAxisLabel('Year')
        .yAxisLabel('Asylum Decisions')
        .dimension(dateDim)
        .group(sentiGroup)
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
        .yAxisLabel("Asylum Descisions")
        .yAxis().ticks(20);
}