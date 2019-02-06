/* global
Highcharts: false
 */
import WeightLog from './weightlog.js';

let log;

function resetDateStamp() {
    const dateString = new Date().toISOString();
    const lastIndex = dateString.lastIndexOf(':');
    return dateString.substring(0, lastIndex);
}

function setChart(data) {
    console.table(data);

    Highcharts.chart('weight-chart', {
        title: {
            text: 'Weight Log'
        },

        subtitle: {
            text: null
        },

        // yAxis: {
        //     title: {
        //         text: 'Number of Employees'
        //     }
        // },
        xAxis: {
            type: 'datetime'
        },
        // legend: {
        //     layout: 'vertical',
        //     align: 'right',
        //     verticalAlign: 'middle'
        // },

        // plotOptions: {
        //     series: {
        //         label: {
        //             connectorAllowed: false
        //         },
        //         pointStart: 2019
        //     }
        // },
        tooltip: {
            valueDecimals: 2,
            valueSuffix: ' Kg'
        },
        series: [{
            name: 'Weight',
            data
        }]

        // responsive: {
        //     rules: [{
        //         condition: {
        //             maxWidth: 500
        //         },
        //         chartOptions: {
        //             legend: {
        //                 layout: 'horizontal',
        //                 align: 'center',
        //                 verticalAlign: 'bottom'
        //             }
        //         }
        //     }]
        // }

    });
}

window.init = () => {
    log = new WeightLog();
    document.getElementById('date-entry').value = resetDateStamp();
    setChart(log.getLog());
};

window.save = () => {
    const inputWeight = document.getElementById('weight-entry');
    const inputDate = document.getElementById('date-entry');
    let weight = inputWeight.value;
    let date = inputDate.value;
    weight = Number.parseFloat(weight);
    date = new Date(`${date}:00`);
    log.write({ date, weight });
    inputWeight.value = '';
    inputDate.value = resetDateStamp();
};

window.getLog = () => {
    console.log(log.getLog());
};

window.clearLog = () => {
    log.clear();
};
