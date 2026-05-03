import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { AssetHistory } from '@/services/assets';

interface AssetChartProps {
    data: AssetHistory[];
    height?: number;
}

const AssetChart: React.FC<AssetChartProps> = ({ data, height = 300 }) => {
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: 40 }}>暂无数据</div>;
    }

    const dates = data.map(item => item.date);
    const assets = data.map(item => item.totalAssets);
    const profits = data.map(item => item.dailyProfit);

    const option = {
        title: {
            text: '总资产趋势',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                const asset = params[0];
                const profit = params[1];
                return `
                    ${asset.axisValue}<br/>
                    总资产: ¥${asset.value.toLocaleString()}<br/>
                    当日盈亏: <span style="color: ${profit.value >= 0 ? '#ff4d4f' : '#52c41a'}">
                        ${profit.value >= 0 ? '+' : ''}¥${profit.value.toLocaleString()}
                    </span>
                `;
            },
        },
        legend: {
            data: ['总资产', '当日盈亏'],
            top: 30,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: dates,
            boundaryGap: false,
        },
        yAxis: [
            {
                type: 'value',
                name: '总资产',
                axisLabel: {
                    formatter: (value: number) => `¥${(value / 10000).toFixed(0)}万`,
                },
            },
            {
                type: 'value',
                name: '当日盈亏',
                position: 'right',
                axisLabel: {
                    formatter: (value: number) => `¥${value}`,
                },
            },
        ],
        series: [
            {
                name: '总资产',
                type: 'line',
                data: assets,
                smooth: true,
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
                        ],
                    },
                },
                lineStyle: {
                    color: '#1890ff',
                    width: 2,
                },
            },
            {
                name: '当日盈亏',
                type: 'bar',
                yAxisIndex: 1,
                data: profits,
                itemStyle: {
                    color: (params: any) => {
                        return params.value >= 0 ? '#ff4d4f' : '#52c41a';
                    },
                },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: `${height}px` }} />;
};

export default AssetChart;
