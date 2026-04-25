import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { palette } from '../theme/tokens';

const width = Dimensions.get('window').width;

export function AppLineChart({ labels, incomeData, expenseData }) {
  const data = {
    labels,
    datasets: [
      {
        data: incomeData,
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(13, 148, 136, ${opacity})`,
      },
      {
        data: expenseData,
        strokeWidth: 2,
        color: (opacity = 1) => `rgba(194, 14, 55, ${opacity})`,
      },
    ],
    legend: ['Income', 'Expense'],
  };

  return (
    <LineChart
      data={data}
      width={width - 72}
      height={220}
      yAxisLabel=""
      yAxisSuffix=""
      withDots={false}
      withInnerLines
      withOuterLines={false}
      transparent
      chartConfig={{
        backgroundGradientFrom: palette.surface,
        backgroundGradientTo: palette.surface,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(102, 112, 133, ${opacity})`,
        propsForBackgroundLines: {
          strokeDasharray: '',
          stroke: '#EEF2FB',
          strokeWidth: 1,
        },
      }}
      bezier
      style={{ borderRadius: 16 }}
    />
  );
}

export function AppDonutChart({ total, ratio = 0.7 }) {
  const safeRatio = Math.max(0, Math.min(1, ratio));
  const data = [
    {
      name: 'Main',
      amount: safeRatio * 100,
      color: palette.primary,
      legendFontColor: palette.textPrimary,
      legendFontSize: 0,
    },
    {
      name: 'Other',
      amount: (1 - safeRatio) * 100,
      color: '#7EE6DD',
      legendFontColor: palette.textPrimary,
      legendFontSize: 0,
    },
  ];

  return (
    <PieChart
      data={data}
      width={width - 72}
      height={220}
      chartConfig={{
        color: () => palette.textPrimary,
      }}
      accessor="amount"
      backgroundColor="transparent"
      paddingLeft="0"
      hasLegend={false}
      center={[0, 0]}
      absolute
      avoidFalseZero
      donut
      innerRadius={72}
    />
  );
}
