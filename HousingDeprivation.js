
const url = "https://script.google.com/macros/s/AKfycbytQHIRHVuI9dQugwZ8ZPpDpF4L_dDjKbq1gtAk8NWNgsXOS-x3/exec?topic=HousingDeprivation"

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
    // data.forEach(function(d){
    //     d['count'] = parseInt(d['count'])
    //   });
    AsylumDescisionPerYearBarChart(data)
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

function AsylumDescisionPerYearBarChart(CountryData) {
    console.log(CountryData)
    var ndx = crossfilter(CountryData)
    var countryDim = ndx.dimension(dc.pluck("year"));
    var countryMix = countryDim.group().reduce(
        function(p, v) {
            //average calculator
            p.count++;
            p.total += parseInt(v['count']);
            p.average = p.total / p.count;
            return p;
        },
        function(p, v) {
            p.count--;
            if (p.count == 0) {
                p.total = 0;
                p.average = 0;
            } else {
                p.total -= v['count'];
                p.average = p.total / p.count;
            }
            return p;
        },
        function () {
            return { count: 0, total: 0, average: 0};
        }
    )
    dc.barChart("#HousingDeprivation")
        .width(1550)
        .height(550)
        .margins({top: 20, right: 50, bottom: 100, left: 80})
        .dimension(countryDim)
        .group(countryMix)
        .valueAccessor(function(d) {
            return d.value.average
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Year")
        .yAxisLabel("Percentage of Housing Deprivation")
        .yAxis().ticks(20);
}