import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const BarGraph = ({datasetX, datasetY, chartTitle}) => {
    useEffect(() => {
        var myChart = echarts.init(document.getElementById('bar-graph-container'));
        
        const option = {
            title: {
                text: chartTitle,
                left: 'center'
            },
            xAxis: {
              type: 'category',
              data: datasetX
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                data: datasetY,
                type: 'bar'
              }
            ]
          };

        myChart.setOption(option);

        // Cleanup function
        return () => {
            myChart.dispose(); // Dispose the chart instance when component unmounts
        };
    }, [chartTitle]); // Update chart when user types a title

    return (
        <div id="bar-graph-container" className='pie-chart-container' style={{ width: '800px', height: '500px' }}></div>
    );
};

export default BarGraph