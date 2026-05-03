import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { AssetHistory } from '@/services/assets';

interface ProfitChartProps {
    data: AssetHistory[];
    height?: number;
}

const ProfitChart: React.FC<ProfitChartProps> = ({ data, height = 300 }) => {
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: 40 }}>暂无数据</div>;
    }

    const dates = data.slice(-14); // 最近14天
    const profits = dates.map(item => item.dailyProfit);

    const option = {
        title: {
            text: '每日盈亏分析',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
            formatter: (params: any) => {
                const param = params[0];
                return `
                    ${param.axisValue}<br/>
                    盈亏: <span style="color: ${param.value >= 0 ? '#ff4d4f' : '#52c41a'}">
                        ${param.value >= 0 ? '+' : ''}¥${param.value.toLocaleString()}
                    </span>
                `;
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: dates.map(item => item.date.substring(5)), // 只显示月-日
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: (value: number) => `¥${value}`,
            },
        },
        series: [
            {
                name: '每日盈亏',
                type: 'bar',
                data: profits,
                itemStyle: {
                    color: (params: any) => {
                        return params.value >= 0 ? '#ff4d4f' : '#52c41a';
                    },
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: (params: any) => {
                        return params.value >= 0 ? `+${params.value}` : params.value;
                    },
                },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: `${height}px` }} />;
};

export default ProfitChart;
