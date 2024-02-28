import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const PieChart = ({ dataset, chartTitle }) => {
    useEffect(() => {
        var myChart = echarts.init(document.getElementById('pie-chart-container'));
        
        const option = {
            title: {
                text: chartTitle,
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: dataset,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        myChart.setOption(option);

        // Cleanup function
        return () => {
            myChart.dispose(); // Dispose the chart instance when component unmounts
        };
    }, [dataset, chartTitle]); // Update chart when user selects a new variable or types a title

    return (
        <div id="pie-chart-container" className='pie-chart-container' style={{ width: '800px', height: '500px' }}></div>
    );
};

export default PieChart;
