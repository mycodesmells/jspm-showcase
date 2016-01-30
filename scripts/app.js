import $ from 'npm:jquery@2.2.0'
import Highcharts from 'highcharts/highcharts'
import data from './data';

Highcharts.setOptions({
    lang: {
        decimalPoint: "."
    }
});

$(function () {
    $("#chartContainer").highcharts({
        title: {
            text: 'NBA Scorers throughout career'
        },
        series: []
    });

    var chart = $("#chartContainer").highcharts();

    fetchData((allSeries) => {
        allSeries.forEach((serie, index) => {
            setTimeout(chart.addSeries.bind(chart, serie), 2000*index);
        })
    });
});

function fetchData(callback) {
    callback(data);
}
