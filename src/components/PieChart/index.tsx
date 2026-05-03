import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { PositionDistribution } from '@/services/assets';

interface PieChartProps {
    data: PositionDistribution[];
    height?: number;
}

const PieChart: React.FC<PieChartProps> = ({ data, height = 300 }) => {
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: 40 }}>暂无持仓</div>;
    }

    const option = {
        title: {
            text: '持仓分布',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                return `
                    ${params.name}<br/>
                    市值: ¥${params.value.toLocaleString()}<br/>
                    占比: ${params.percent}%
                `;
            },
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle',
        },
        series: [
            {
                name: '持仓分布',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                label: {
                    show: true,
                    formatter: '{b}: {d}%',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold',
                    },
                },
                data: data.map(item => ({
                    name: item.symbol,
                    value: item.value,
                })),
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: `${height}px` }} />;
};

export default PieChart;
