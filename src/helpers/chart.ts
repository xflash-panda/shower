// 图表数据点类型
export interface ChartDataPoint {
  x: number | string;
  y: number;
  z?: number;
}

// 时间序列数据点类型
export type TimeSeriesDataPoint = [number, number];

// 热力图数据点类型
export interface HeatmapDataPoint {
  x: string;
  y: number;
}

// 颜色转换选项
export interface ColorConversionOptions {
  includeAlpha?: boolean;
  format?: 'rgb' | 'rgba';
}

/**
 * 将十六进制颜色转换为 RGB/RGBA 格式
 * @param hex 十六进制颜色代码 (如: #ff0000)
 * @param alpha 透明度 (0-1)
 * @param options 转换选项
 * @returns RGB 或 RGBA 颜色字符串
 */
export function hexToRGB(
  hex: string,
  alpha?: number,
  _options: ColorConversionOptions = {},
): string {
  // 验证十六进制颜色格式
  if (!/^#[0-9A-F]{6}$/i.test(hex)) {
    console.warn(`Invalid hex color format: ${hex}`);
    return hex; // 返回原值作为降级方案
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // 验证解析的颜色值
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    console.warn(`Failed to parse hex color: ${hex}`);
    return hex;
  }

  // 如果提供了透明度，返回 RGBA
  if (typeof alpha === 'number') {
    const clampedAlpha = Math.max(0, Math.min(1, alpha));
    return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
  }

  return `rgb(${r}, ${g}, ${b})`;
}

export const generateDayWiseTimeSeries = (
  baseval: number,
  count: number,
  yrange: { max: number; min: number },
): TimeSeriesDataPoint[] => {
  let i = 0;
  const series: TimeSeriesDataPoint[] = [];
  while (i < count) {
    const x = baseval;
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push([x, y]);
    baseval += 86400000;
    i++;
  }
  return series;
};

export function generateData(
  baseval: number,
  count: number,
  yrange: { max: number; min: number },
): number[][] {
  let i = 0;
  const series: number[][] = [];
  while (i < count) {
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

    series.push([baseval, y, z]);
    baseval += 86400000;
    i++;
  }
  return series;
}

export function generateHeatmapData(
  count: number,
  yrange: { max: number; min: number },
): HeatmapDataPoint[] {
  let i = 0;
  const series: HeatmapDataPoint[] = [];
  while (i < count) {
    const x = (i + 1).toString();
    const y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push({
      x,
      y,
    });
    i++;
  }
  return series;
}
