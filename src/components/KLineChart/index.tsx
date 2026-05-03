import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { KLineData } from '@/services/kline';

interface KLineChartProps {
    data: KLineData[];
    height?: number;
}

const KLineChart: React.FC<KLineChartProps> = ({ data, height = 400 }) => {
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: 40 }}>暂无数据</div>;
    }

    // 提取数据
    const dates = data.map(item => item.date);
    const values = data.map(item => [item.open, item.close, item.low, item.high]);
    const volumes = data.map((item, index) => [index, item.volume, item.close > item.open ? 1 : -1]);

    // 计算 MA 均线
    const calculateMA = (dayCount: number) => {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            if (i < dayCount - 1) {
                result.push('-');
                continue;
            }
            let sum = 0;
            for (let j = 0; j < dayCount; j++) {
                sum += data[i - j].close;
            }
            result.push((sum / dayCount).toFixed(2));
        }
        return result;
    };

    const ma5 = calculateMA(5);
    const ma10 = calculateMA(10);
    const ma20 = calculateMA(20);

    const option = {
        title: {
            text: 'K线图',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
            },
        },
        legend: {
            data: ['K线', 'MA5', 'MA10', 'MA20'],
            top: 30,
        },
        grid: [
            {
                left: '10%',
                right: '8%',
                top: '15%',
                height: '50%',
            },
            {
                left: '10%',
                right: '8%',
                top: '70%',
                height: '20%',
            },
        ],
        xAxis: [
            {
                type: 'category',
                data: dates,
                scale: true,
                boundaryGap: false,
                axisLine: { onZero: false },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax',
            },
            {
                type: 'category',
                gridIndex: 1,
                data: dates,
                axisLabel: { show: false },
            },
        ],
        yAxis: [
            {
                scale: true,
                splitArea: {
                    show: true,
                },
            },
            {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
            },
        ],
        dataZoom: [
            {
                type: 'inside',
                start: 50,
                end: 100,
            },
            {
                show: true,
                type: 'slider',
                top: '90%',
                start: 50,
                end: 100,
            },
        ],
        series: [
            {
                name: 'K线',
                type: 'candlestick',
                data: values,
                itemStyle: {
                    color: '#ef232a',
                    color0: '#14b143',
                    borderColor: '#ef232a',
                    borderColor0: '#14b143',
                },
            },
            {
                name: 'MA5',
                type: 'line',
                data: ma5,
                smooth: true,
                lineStyle: {
                    opacity: 0.5,
                },
            },
            {
                name: 'MA10',
                type: 'line',
                data: ma10,
                smooth: true,
                lineStyle: {
                    opacity: 0.5,
                },
            },
            {
                name: 'MA20',
                type: 'line',
                data: ma20,
                smooth: true,
                lineStyle: {
                    opacity: 0.5,
                },
            },
            {
                name: '成交量',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: volumes,
                itemStyle: {
                    color: (params: any) => {
                        return params.value[2] > 0 ? '#ef232a' : '#14b143';
                    },
                },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: `${height}px` }} />;
};

export default KLineChart;
