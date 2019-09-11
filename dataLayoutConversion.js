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

// convert 

// [ {
//     2013: 0
//     2014: 0
//     2015: 0
//     2016: 0
//     2017: 0
//     2018: 0
//     citizen: "EXT_EU28"
//     country: "Austria"
//     decision: "TEMP_PROT"
//     geo\time: "AT"}]

//  to : [{ citizen: "EXT_EU28"
// count: 12635
// country: "Greece"
// decision: "GENCONV"
// geo\time: "EL"
// year: "2018" }
// {
// citizen: "EXT_EU28"
// count: 9420
// country: "Greece"
// decision: "GENCONV"
// geo\time: "EL"
// year: "2017" }
// {
// citizen: "EXT_EU28"
// count: 2470
// country: "Greece"
// decision: "GENCONV"
// geo\time: "EL"
// year: "2016"}{
// citizen: "EXT_EU28"
// count: 3665
// country: "Greece"
// decision: "GENCONV"
// geo\time: "EL"
// year: "2015"}{
// citizen: "EXT_EU28"
// count: 1270
// country: "Greece"
// decision: "GENCONV"
// geo\time: "EL"
// year: "2014"}
// {citizen: "EXT_EU28"
// count: 255
// country: "Greece"
// decision: "GENCONV"
// geo\time: "EL"
// year: "2013"}]