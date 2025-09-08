import React, { useMemo, useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
import { getCurrentTheme } from '@/helpers/theme';

interface TrafficHeatMapData {
  [date: string]: API_V1.User.TrafficHeatMapItem;
}

// 组件 Props 接口
interface TrafficHeatMapProps {
  /** 流量热力图数据 */
  data?: Record<string, API_V1.User.TrafficHeatMapItem> | null;
}

interface HeatmapDataPoint {
  x: string;
  y: number;
  date: string;
  dayName: string;
}

interface HeatmapSeriesItem {
  name: string;
  data: HeatmapDataPoint[];
}

interface ApexTooltipParams {
  seriesIndex: number;
  dataPointIndex: number;
  w: {
    globals: {
      initialSeries: HeatmapSeriesItem[];
    };
  };
}

// 颜色操作辅助函数
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (n: number): string => {
    const hex = n.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const adjustColorOpacity = (rgbValues: string, opacity: number, isDarkMode = false): string => {
  const [r, g, b] = rgbValues.split(',').map(num => parseInt(num.trim()));

  if (isDarkMode) {
    // 深色模式：透明度较低时，颜色更接近深色背景（约#2d333b）
    const bgR = 45,
      bgG = 51,
      bgB = 59;
    const adjustedR = Math.round(r * opacity + bgR * (1 - opacity));
    const adjustedG = Math.round(g * opacity + bgG * (1 - opacity));
    const adjustedB = Math.round(b * opacity + bgB * (1 - opacity));

    return rgbToHex(
      Math.max(0, Math.min(255, adjustedR)),
      Math.max(0, Math.min(255, adjustedG)),
      Math.max(0, Math.min(255, adjustedB)),
    );
  } else {
    // 浅色模式：透明度较低时，颜色更接近白色
    const adjustedR = Math.round(r * opacity + 255 * (1 - opacity));
    const adjustedG = Math.round(g * opacity + 255 * (1 - opacity));
    const adjustedB = Math.round(b * opacity + 255 * (1 - opacity));

    return rgbToHex(
      Math.max(0, Math.min(255, adjustedR)),
      Math.max(0, Math.min(255, adjustedG)),
      Math.max(0, Math.min(255, adjustedB)),
    );
  }
};

const adjustColorBrightness = (rgbString: string, factor: number): string => {
  const [r, g, b] = rgbString.split(',').map(num => parseInt(num.trim()));

  const adjust = (value: number) => {
    const adjusted = Math.round(value * factor);
    return Math.max(0, Math.min(255, adjusted));
  };

  return rgbToHex(adjust(r), adjust(g), adjust(b));
};

// 获取动态颜色方案
const getColorScheme = (isDarkMode: boolean) => {
  // 尝试从app-wrapper获取当前主题的颜色值
  const appWrapper = document.querySelector('.app-wrapper');
  let primaryColorValue = '';

  if (appWrapper) {
    // 获取app-wrapper的计算样式，这样可以获取到当前应用的主题颜色
    const computedStyle = getComputedStyle(appWrapper);
    primaryColorValue = computedStyle.getPropertyValue('--primary').trim();

    // 如果app-wrapper没有--primary变量，则从document.documentElement获取
    if (!primaryColorValue) {
      const documentStyle = getComputedStyle(document.documentElement);
      primaryColorValue = documentStyle.getPropertyValue('--primary').trim();
    }
  }

  // 如果无法获取到主题颜色，使用默认值
  if (!primaryColorValue) {
    primaryColorValue = '140, 118, 240'; // 默认紫色（对应SCSS中的default主题）
  }

  // 移除可能的rgb()包装
  primaryColorValue = primaryColorValue.replace(/rgb\(|\)/g, '');

  // 根据主题生成不同透明度的颜色
  const scheme = {
    noData: isDarkMode ? '#2d333b' : '#ebedf0',
    level1: adjustColorOpacity(primaryColorValue, 0.3, isDarkMode),
    level2: adjustColorOpacity(primaryColorValue, 0.5, isDarkMode),
    level3: adjustColorOpacity(primaryColorValue, 0.7, isDarkMode),
    level4: adjustColorOpacity(primaryColorValue, 0.9, isDarkMode),
    stroke: isDarkMode ? '#21262d' : '#ffffff',
    tooltipBg: isDarkMode ? '#161b22' : '#ffffff',
    tooltipColor: isDarkMode ? '#f0f6fc' : '#24292f',
  };

  // 调整深色模式下的颜色亮度
  if (isDarkMode) {
    scheme.level1 = adjustColorBrightness(primaryColorValue, 0.6);
    scheme.level2 = adjustColorBrightness(primaryColorValue, 0.8);
    scheme.level3 = adjustColorBrightness(primaryColorValue, 1.0);
    scheme.level4 = adjustColorBrightness(primaryColorValue, 1.2);
  }

  return scheme;
};

const TrafficHeatMap = ({ data }: TrafficHeatMapProps) => {
  const { t } = useTranslation('traffic');

  // 主题状态检测
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeUpdateTrigger, setThemeUpdateTrigger] = useState(0);

  useEffect(() => {
    // 检测当前主题
    const checkTheme = () => {
      const storedTheme = getCurrentTheme();
      const bodyHasDark = document.body.classList.contains('dark');
      const newIsDarkMode = storedTheme === 'dark' || bodyHasDark;

      // 只有在主题真正改变时才更新状态
      setIsDarkMode(prevMode => {
        if (prevMode !== newIsDarkMode) {
          setThemeUpdateTrigger(prev => prev + 1);
          return newIsDarkMode;
        }
        return prevMode;
      });

      // 无论如何都要触发一次更新，以防颜色主题变化但明暗模式未变化
      setThemeUpdateTrigger(prev => prev + 1);
    };

    // 初始检测
    checkTheme();

    // 监听主题变化 - 监听body的class变化（明暗模式）
    const bodyObserver = new MutationObserver(mutations => {
      let shouldUpdate = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        setTimeout(checkTheme, 50); // 延迟一点确保CSS变量已更新
      }
    });

    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // 监听documentElement的class变化
    const htmlObserver = new MutationObserver(mutations => {
      let shouldUpdate = false;
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          shouldUpdate = true;
        }
      });

      if (shouldUpdate) {
        setTimeout(checkTheme, 50);
      }
    });

    htmlObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // 监听app-wrapper的class变化（主题颜色切换）
    const appWrapper = document.querySelector('.app-wrapper');
    let appWrapperObserver: MutationObserver | null = null;

    if (appWrapper) {
      appWrapperObserver = new MutationObserver(mutations => {
        let shouldUpdate = false;
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            shouldUpdate = true;
          }
        });

        if (shouldUpdate) {
          setTimeout(checkTheme, 50); // 延迟确保新的CSS变量已生效
        }
      });

      appWrapperObserver.observe(appWrapper, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    // 监听localStorage变化（主题设置）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme' || e.key === 'layout' || e.key?.includes('color')) {
        setTimeout(checkTheme, 100);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      bodyObserver.disconnect();
      htmlObserver.disconnect();
      if (appWrapperObserver) {
        appWrapperObserver.disconnect();
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 处理热力图数据 - 生成类似GitHub贡献图的一年数据
  const heatmapSeries = useMemo((): HeatmapSeriesItem[] => {
    // 如果没有数据，返回空数组
    if (!data) {
      return [];
    }

    // 计算一年前的日期作为起始日期
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    startDate.setMonth(endDate.getMonth());
    startDate.setDate(endDate.getDate());

    // 调整到周一开始
    const dayOfWeek = startDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(startDate.getDate() + mondayOffset);

    // 生成完整的日期序列
    const allDates: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      allDates.push(dateStr);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 补齐到完整周（如果最后一周不满7天）
    const remainingDays = 7 - (allDates.length % 7);
    if (remainingDays !== 7) {
      for (let i = 0; i < remainingDays; i++) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + i);
        allDates.push(nextDate.toISOString().split('T')[0]);
      }
    }

    // 按日期索引组织数据（每个数据点代表一天）
    const weekDays = [
      t('heatMap.weekDays.monday'),
      t('heatMap.weekDays.tuesday'),
      t('heatMap.weekDays.wednesday'),
      t('heatMap.weekDays.thursday'),
      t('heatMap.weekDays.friday'),
      t('heatMap.weekDays.saturday'),
      t('heatMap.weekDays.sunday'),
    ];
    const series: HeatmapSeriesItem[] = weekDays.map((dayName, dayIndex) => {
      const dayData: HeatmapDataPoint[] = [];

      // 从对应的星期几开始，每7天取一个数据点
      for (let i = dayIndex; i < allDates.length; i += 7) {
        const date = allDates[i];
        const traffic = (data as TrafficHeatMapData)[date];

        // 确保所有日期都有数据占位，即使没有流量数据
        const totalGB = traffic ? traffic.total / (1024 * 1024 * 1024) : 0;

        dayData.push({
          x: Math.floor(i / 7).toString(), // 周序号
          y: totalGB > 0 ? Math.round(totalGB * 100) / 100 : 0, // 空数据显示为0
          date,
          dayName,
        });
      }

      return {
        name: dayName,
        data: dayData,
      };
    });

    return series;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // 计算流量范围用于颜色映射
  const trafficRange = useMemo(() => {
    if (!data) return { min: 0, max: 10 };

    const allValues = Object.values(data).map(item => item.total / (1024 * 1024 * 1024));
    if (allValues.length === 0) return { min: 0, max: 10 };
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    return { min, max };
  }, [data]);

  // 动态生成热力图配置
  const heatmapOptions = useMemo(() => {
    const colorScheme = getColorScheme(isDarkMode);

    return {
      chart: {
        toolbar: {
          show: false,
        },
        background: 'transparent',
        sparkline: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false, // 关闭数据标签，让格子更干净
      },
      tooltip: {
        enabled: true,
        custom({ seriesIndex, dataPointIndex, w }: ApexTooltipParams): string {
          const pointData = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          if (!pointData) return '';

          const date: string = pointData.date;
          const dayName: string = pointData.dayName;

          // 从原始数据中获取详细的流量信息
          const trafficData: API_V1.User.TrafficHeatMapItem | undefined = data
            ? (data as TrafficHeatMapData)[date]
            : undefined;

          // 即使没有流量数据也要显示tooltip，显示为空数据占位
          const totalGB = trafficData ? trafficData.total / (1024 * 1024 * 1024) : 0;
          const upGB = trafficData ? trafficData.u / (1024 * 1024 * 1024) : 0;
          const downGB = trafficData ? trafficData.d / (1024 * 1024 * 1024) : 0;
          const requestCount = trafficData ? (trafficData.n ?? 0) : 0;

          // 格式化请求次数显示
          const formatRequestCount = (count: number): string => {
            if (count >= 1000000) {
              return `${(count / 1000000).toFixed(1)} M`;
            } else if (count >= 1000) {
              return `${(count / 1000).toFixed(1)} K`;
            }
            return count.toString();
          };

          // 根据是否有数据显示不同的提示信息

          return `
            <div class="custom-tooltip" style="background: ${colorScheme.tooltipBg}; color: ${colorScheme.tooltipColor}; padding: 12px 16px; border-radius: 6px; font-size: 13px; min-width: 180px;">
              <div style="font-weight: bold; margin-bottom: 6px;">${date} (${dayName})</div>
              <div style="margin-bottom: 3px;">
                <span style="color: ${colorScheme.level3};">${t('heatMap.tooltip.totalTraffic')}:</span> 
                <span style="float: right; font-weight: bold;">${totalGB.toFixed(2)} GB</span>
              </div>
              <div style="margin-bottom: 3px;">
                <span style="color: ${colorScheme.level3};">${t('heatMap.tooltip.uploadTraffic')}:</span> 
                <span style="float: right;">${upGB.toFixed(2)} GB</span>
              </div>
              <div style="margin-bottom: 3px;">
                <span style="color: ${colorScheme.level3};">${t('heatMap.tooltip.downloadTraffic')}:</span> 
                <span style="float: right;">${downGB.toFixed(2)} GB</span>
              </div>
              <div>
                <span style="color: ${colorScheme.level3};">${t('heatMap.tooltip.requestCount')}:</span> 
                <span style="float: right;">${formatRequestCount(requestCount)}</span>
              </div>
            </div>
          `;
        },
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          radius: 2, // 减小圆角
          useFillColorAsStroke: false,
          enableShades: true,
          colorScale: {
            ranges: [
              {
                from: 0,
                to: 0,
                name: 'n/a',
                color: colorScheme.noData,
              },
              {
                from: 0.001,
                to: 1,
                name: '≤1GB',
                color: colorScheme.level1,
              },
              {
                from: 1,
                to: 3,
                name: '1-3GB',
                color: colorScheme.level2,
              },
              {
                from: 3,
                to: 6,
                name: '3-6GB',
                color: colorScheme.level3,
              },
              {
                from: 6,
                to: trafficRange.max,
                name: '>6GB',
                color: colorScheme.level4,
              },
            ],
          },
        },
      },
      stroke: {
        width: 2,
        colors: [colorScheme.stroke],
        dashArray: 0,
        lineCap: 'butt',
      },
      grid: {
        show: false,
        strokeDashArray: 0,
        position: 'back',
      },
      xaxis: {
        type: 'category',
        labels: {
          show: false, // 隐藏横坐标标签
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        tooltip: {
          enabled: false, // 关闭 X 轴 tooltip
        },
      },
      yaxis: {
        labels: {
          show: false, // 隐藏纵坐标标签
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      legend: {
        show: false, // 隐藏图例，让界面更简洁
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode, trafficRange.max, themeUpdateTrigger]);

  return (
    <ApexCharts
      key={`heatmap-${themeUpdateTrigger}-${isDarkMode}`}
      series={heatmapSeries}
      type={'heatmap'}
      height={200} // 减少高度，让格子更紧凑
      options={heatmapOptions}
    />
  );
};

export default TrafficHeatMap;
