import React, { useEffect, useRef } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { palette, spacing, layout, sizing } from '../theme/tokens';
import { styles } from './AppCharts.styles';

const width = Dimensions.get('window').width;

function buildYAxisLabels(values) {
  const maxValue = Math.max(0, ...values);
  const steps = 4;

  if (maxValue === 0) {
    return [0, 0, 0, 0, 0];
  }

  return Array.from({ length: steps + 1 }, (_, index) => Math.round(maxValue - (maxValue / steps) * index));
}

export function AppLineChart({ labels = [], incomeData = [], expenseData = [], width: chartWidthOverride }) {
  const safeLabels = Array.isArray(labels) && labels.length > 0 ? labels : ['No Data'];
  const safeIncome = Array.isArray(incomeData) && incomeData.length > 0 ? incomeData : [0];
  const safeExpense = Array.isArray(expenseData) && expenseData.length > 0 ? expenseData : [0];

  const maxIncome = Math.max(0, ...safeIncome);
  const maxExpense = Math.max(0, ...safeExpense);
  const isAllZero = maxIncome === 0 && maxExpense === 0;

  const defaultWidth = width - layout.screenHorizontal * 2 - spacing.xxl;
  const chartWidth = chartWidthOverride || Math.max(defaultWidth, safeLabels.length * 72);
  const yAxisLabels = buildYAxisLabels([...safeIncome, ...safeExpense]);
  const scrollRef = useRef(null);

  const data = {
    labels: safeLabels,
    datasets: [
      {
        data: isAllZero ? safeIncome.map(() => 0) : safeIncome,
        strokeWidth: sizing.chart.strokeMd,
        color: (opacity = 1) => `rgba(13, 148, 136, ${opacity})`,
      },
      {
        data: isAllZero ? safeExpense.map(() => 0) : safeExpense,
        strokeWidth: sizing.chart.strokeMd,
        color: (opacity = 1) => `rgba(194, 14, 55, ${opacity})`,
      },
    ],
    legend: ['Income', 'Expense'],
  };

  useEffect(() => {
    if (!scrollRef.current || chartWidth <= defaultWidth) return;

    const scrollToLatest = () => {
      scrollRef.current?.scrollToEnd({ animated: false });
    };

    const timer = setTimeout(scrollToLatest, 0);
    return () => clearTimeout(timer);
  }, [chartWidth, defaultWidth, safeLabels.length]);

  return (
    <View style={styles.lineChartRow}>
      <View style={styles.yAxisColumn}>
        {yAxisLabels.map((value, index) => (
          <Text key={`${value}-${index}`} style={styles.yAxisLabel}>
            {value}
          </Text>
        ))}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.lineChartScroll}
      >
        <LineChart
          data={data}
          width={chartWidth}
          height={sizing.chart.heightMd}
          yAxisLabel=""
          yAxisSuffix=""
          withDots={!isAllZero}
          withInnerLines
          withOuterLines={false}
          withHorizontalLabels={false}
          withVerticalLabels
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
              strokeWidth: sizing.chart.strokeSm,
            },
          }}
          bezier={!isAllZero}
          style={[styles.lineChart, styles.lineChartInner]}
        />
      </ScrollView>
    </View>
  );
}

export function AppDonutChart({ total = 0, ratio = 0.7, segments = [] }) {
  const isZeroTotal = !total || total === 0 || !Array.isArray(segments) || segments.length === 0;

  const data = isZeroTotal
    ? [
        {
          name: 'No Expenses',
          amount: 100,
          color: palette.border || '#E4E7EC',
          legendFontColor: palette.textMuted,
          legendFontSize: sizing.chart.legendNone,
        },
      ]
    : segments.map((segment) => ({
        name: segment.name,
        amount: Math.max(0, Number(segment.amount) || 0),
        color: segment.color,
        legendFontColor: palette.textPrimary,
        legendFontSize: sizing.chart.legendNone,
      }));

  return (
    <PieChart
      data={data}
      width={width - layout.screenHorizontal * 2 - spacing.xxl}
      height={sizing.chart.heightMd}
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
      innerRadius={layout.screenHorizontal * 4 + spacing.sm}
    />
  );
}
