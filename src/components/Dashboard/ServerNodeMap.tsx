import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';
import {
  getThemeBackgroundColor,
  getCSSVariableColor,
  getCSSVariableColorWithAlpha,
} from '@/helpers/theme';
// 扩展VectorMap的样式类型以支持r属性
interface MarkerStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  r: number;
  cursor?: string;
  color?: string;
}

interface ServerNodeMapProps {
  className?: string;
  serverData?: API_V1.User.ServerOverviewItem[];
}

interface MapColors {
  backgroundColor: string;
  fillColor: string;
  markerColor: string;
  hoverColor: string;
  accentColor: string;
}

// 创建颜色配置函数，使用 theme.ts 中的工具函数
const createMapColors = (): MapColors => {
  return {
    backgroundColor: getThemeBackgroundColor(),
    fillColor: getCSSVariableColor('primary'),
    markerColor: getCSSVariableColor('secondary'),
    hoverColor: getCSSVariableColorWithAlpha('info', 0.8),
    accentColor: getCSSVariableColorWithAlpha('warning', 0.9),
  };
};

const ServerNodeMap = ({ className, serverData }: ServerNodeMapProps) => {
  const { t } = useTranslation('dashboard');
  const [mapColors, setMapColors] = useState<MapColors>(() => createMapColors());
  const [mapKey, setMapKey] = useState<number>(0);

  // 监听主题变化并更新颜色
  useEffect(() => {
    const updateColors = (): void => {
      setMapColors(prevColors => {
        const newColors = createMapColors();

        // 比较颜色是否真正发生了变化
        const colorsChanged =
          newColors.backgroundColor !== prevColors.backgroundColor ||
          newColors.fillColor !== prevColors.fillColor ||
          newColors.markerColor !== prevColors.markerColor ||
          newColors.hoverColor !== prevColors.hoverColor ||
          newColors.accentColor !== prevColors.accentColor;

        if (colorsChanged) {
          // 强制重新渲染 VectorMap 组件
          setMapKey(prev => prev + 1);
          return newColors;
        }

        return prevColors;
      });
    };

    // 监听DOM变化（主题切换）
    const observer = new MutationObserver(mutations => {
      let shouldUpdate = false;

      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          // 监听body的class变化（明暗模式切换）
          if (mutation.target === document.body) {
            shouldUpdate = true;
          }
          // 监听app-wrapper的class变化（主题颜色切换）
          if (
            mutation.target instanceof Element &&
            mutation.target.classList?.contains('app-wrapper')
          ) {
            shouldUpdate = true;
          }
        }
      });

      if (shouldUpdate) {
        // 延迟更新确保CSS变量已生效
        setTimeout(updateColors, 50);
      }
    });

    // 监听body和app-wrapper的class变化
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const appWrapper = document.querySelector('.app-wrapper');
    if (appWrapper) {
      observer.observe(appWrapper, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // 生成地图标记点 - 优先使用传入的数据，否则使用默认空数组
  const dataToUse = serverData && serverData.length > 0 ? serverData : [];
  const markers = dataToUse.map((item: API_V1.User.ServerOverviewItem) => {
    // 方案1: 使用换行符分隔，每行一个信息
    const displayInfo = `${item.flag}${item.country}${item.city}\n${t('nodeMap.nodeCount')}: ${item.server_total}\n${t('nodeMap.loadInfo')}: ${item.server_load.toFixed(2)}`;

    return {
      latLng: [item.lat, item.lng],
      name: displayInfo,
    };
  });

  const _handleMarkerClick = (_event: any, _code: string) => {};

  const _handleRegionClick = (_event: any, _code: string) => {};

  return (
    <div className={`${className ?? ''}`}>
      {/* 服务器节点地图容器 */}
      <div className="w-100 h-400 b-r-10 overflow-hidden ">
        <VectorMap
          key={mapKey}
          map={worldMill}
          backgroundColor={mapColors.backgroundColor}
          regionStyle={{
            initial: {
              fill: mapColors.fillColor,
              fillOpacity: 0.6,
              stroke: 'none',
              strokeWidth: 0,
              strokeOpacity: 1,
            },
            hover: {
              fill: mapColors.hoverColor,
              fillOpacity: 0.8,
              stroke: mapColors.fillColor,
              strokeWidth: 1,
              cursor: 'pointer',
            },
          }}
          markerStyle={{
            initial: {
              fill: mapColors.markerColor,
              stroke: mapColors.backgroundColor,
              strokeWidth: 2,
              r: 6,
            } as MarkerStyle,
            hover: {
              fill: mapColors.accentColor,
              stroke: mapColors.backgroundColor,
              strokeWidth: 3,
              r: 8,
              cursor: 'pointer',
            } as MarkerStyle,
          }}
          markers={markers}
          onMarkerClick={_handleMarkerClick}
          onRegionClick={_handleRegionClick}
        />
      </div>

      {/* 地图说明信息 */}
      <div className="mg-t-15">
        <div className="d-flex justify-content-between align-items-center mg-b-10">
          <small className="text-dark">
            <i className="ph-duotone ph-info me-1"></i>
            {t('nodeMap.clickMarkerForDetails')}
          </small>
          <small className="text-dark">
            {markers.length} {t('nodeMap.activeNodes')}
          </small>
        </div>
      </div>
    </div>
  );
};

export default ServerNodeMap;
