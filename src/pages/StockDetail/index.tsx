import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, message, Descriptions } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { stockService } from '@/services/stock';
import { klineService, KLineData } from '@/services/kline';
import KLineChart from '@/components/KLineChart';

interface StockDetailVO {
    symbol: string;
    name: string;
    market: string;
    industry: string;
    isSt: boolean;
}

interface StockDetailResponse {
    code: number;
    data: StockDetailVO;
    message?: string;
}

const StockDetail: React.FC = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const navigate = useNavigate();
    const [stock, setStock] = useState<StockDetailVO | null>(null);
    const [klineData, setKlineData] = useState<KLineData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (symbol) {
            void loadStockDetail(symbol);
            void loadKLineData(symbol);
        }
    }, [symbol]);

    const loadStockDetail = async (sym: string) => {
        try {
            const res = await stockService.getDetail(sym) as unknown as StockDetailResponse;
            if (res.code === 200) {
                setStock(res.data);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err.response?.data?.message || '加载股票详情失败');
        }
    };

    const loadKLineData = async (sym: string) => {
        setLoading(true);
        try {
            const data = await klineService.getKLineData(sym, 60);
            setKlineData(data);
        } catch (error: unknown) {
            console.error('加载K线数据失败', error);
        } finally {
            setLoading(false);
        }
    };

    if (!stock) {
        return <div style={{ padding: 24 }}>加载中...</div>;
    }

    return (
        <div style={{ padding: 24 }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ marginBottom: 16 }}
            >
                返回
            </Button>

            {/* 股票基本信息 */}
            <Card style={{ marginBottom: 16 }}>
                <Descriptions title={`${stock.name} (${stock.symbol})`} column={3}>
                    <Descriptions.Item label="市场">{stock.market}</Descriptions.Item>
                    <Descriptions.Item label="行业">{stock.industry}</Descriptions.Item>
                    <Descriptions.Item label="ST标记">{stock.isSt ? '是' : '否'}</Descriptions.Item>
                </Descriptions>
            </Card>

            {/* K线图 */}
            <Card title="K线图" loading={loading}>
                <KLineChart data={klineData} height={500} />
            </Card>
        </div>
    );
};

export default StockDetail;
