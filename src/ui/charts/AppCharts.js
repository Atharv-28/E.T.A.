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

export function AppLineChart({ labels, incomeData, expenseData, width: chartWidthOverride }) {
  const defaultWidth = width - layout.screenHorizontal * 2 - spacing.xxl;
  const scrollRef = useRef(null);

  // Sanitize data: replace any non-finite values with 0 to prevent Infinity SVG paths
  const safeIncome = (Array.isArray(incomeData) ? incomeData : []).map((v) =>
    Number.isFinite(v) && v >= 0 ? v : 0
  );
  const safeExpense = (Array.isArray(expenseData) ? expenseData : []).map((v) =>
    Number.isFinite(v) && v >= 0 ? v : 0
  );
  const safeLabels = Array.isArray(labels) ? labels : [];

  // Must have at least one data point; chart crashes on empty arrays
  const hasData = safeLabels.length > 0 && safeIncome.length > 0;

  // Clamp to a minimum of 1 so division inside the chart lib never yields Infinity
  const chartWidth = Math.max(
    1,
    chartWidthOverride || Math.max(defaultWidth, safeLabels.length * 72)
  );

  const yAxisLabels = buildYAxisLabels([...safeIncome, ...safeExpense]);

  const data = {
    labels: safeLabels,
    datasets: [
      {
        data: safeIncome.length > 0 ? safeIncome : [0],
        strokeWidth: sizing.chart.strokeMd,
        color: (opacity = 1) => `rgba(13, 148, 136, ${opacity})`,
      },
      {
        data: safeExpense.length > 0 ? safeExpense : [0],
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

  if (!hasData) {
    return (
      <View style={styles.lineChartRow}>
        <Text style={[styles.yAxisLabel, { flex: 1, textAlign: 'center', paddingVertical: 24 }]}>
          No trend data yet.
        </Text>
      </View>
    );
  }

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
          withDots={false}
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
          bezier
          style={[styles.lineChart, styles.lineChartInner]}
        />
      </ScrollView>
    </View>
  );
}

export function AppDonutChart({ total, ratio = 0.7, segments }) {
  // Filter out zero-amount segments — they produce L-Infinity SVG paths
  const validSegments = Array.isArray(segments)
    ? segments.filter((s) => s.amount > 0)
    : [];

  const data =
    validSegments.length > 0
      ? validSegments.map((segment) => ({
          name: segment.name,
          amount: segment.amount,
          color: segment.color,
          legendFontColor: palette.textPrimary,
          legendFontSize: sizing.chart.legendNone,
        }))
      : (() => {
          const safeRatio = Math.max(0.01, Math.min(0.99, ratio));
          return [
            {
              name: 'Main',
              amount: safeRatio * 100,
              color: palette.primary,
              legendFontColor: palette.textPrimary,
              legendFontSize: sizing.chart.legendNone,
            },
            {
              name: 'Other',
              amount: (1 - safeRatio) * 100,
              color: '#7EE6DD',
              legendFontColor: palette.textPrimary,
              legendFontSize: sizing.chart.legendNone,
            },
          ];
        })();

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
