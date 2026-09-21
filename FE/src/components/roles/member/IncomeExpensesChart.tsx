import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { incomeExpensesData } from './mockChartData';

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}Tr`;
  }
  return new Intl.NumberFormat('vi-VN').format(value);
};

const formatTooltipCurrency = (value: number) => {
  return `${new Intl.NumberFormat('vi-VN').format(value)} VNĐ`;
};

const IncomeExpensesChart: React.FC = () => {
  return (
    <div className="member-chart-container">
      <div className="member-chart-header">
        <h3 className="member-chart-title">Income vs Expenses Over Time</h3>
        <p className="member-chart-subtitle">
          Thống kê tổng doanh thu và chi phí hoạt động của Không gian Dòng họ theo từng tháng.
        </p>
      </div>
      <div className="member-chart-split-layout">
        <div className="member-chart-body">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={incomeExpensesData}
              margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={formatCurrency}
                dx={-10}
              />
              <Tooltip
                formatter={(value: number) => [formatTooltipCurrency(value)]}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e0f2fe',
                  boxShadow: '0 4px 20px rgba(14, 165, 233, 0.08)',
                  padding: '12px 16px',
                }}
                itemStyle={{ fontWeight: 600 }}
                labelStyle={{ color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 600 }}
              />
              <Line
                name="Tổng thu (Income)"
                type="monotone"
                dataKey="income"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }}
              />
              <Line
                name="Tổng chi (Expenses)"
                type="monotone"
                dataKey="expenses"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#f59e0b' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="member-chart-stats">
          <div className="member-chart-stat-card">
            <h4 className="stat-card-title">Tổng Doanh Thu</h4>
            <p className="stat-card-value income-value">
              {formatCurrency(incomeExpensesData.reduce((acc, curr) => acc + curr.income, 0))}
            </p>
            <span className="stat-card-trend trend-up">
              +15.2% so với tháng trước
            </span>
          </div>
          
          <div className="member-chart-stat-card">
            <h4 className="stat-card-title">Tổng Chi Phí</h4>
            <p className="stat-card-value expense-value">
              {formatCurrency(incomeExpensesData.reduce((acc, curr) => acc + curr.expenses, 0))}
            </p>
            <span className="stat-card-trend trend-down">
              Tối ưu chi phí tốt
            </span>
          </div>
          
          <div className="member-chart-stat-card">
            <h4 className="stat-card-title">Lợi Nhuận Thuần</h4>
            <p className="stat-card-value profit-value">
              {formatCurrency(incomeExpensesData.reduce((acc, curr) => acc + (curr.income - curr.expenses), 0))}
            </p>
            <span className="stat-card-trend trend-up">
              Biên lợi nhuận {
                ((incomeExpensesData.reduce((acc, curr) => acc + (curr.income - curr.expenses), 0) / 
                incomeExpensesData.reduce((acc, curr) => acc + curr.income, 0)) * 100).toFixed(1)
              }%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeExpensesChart;
