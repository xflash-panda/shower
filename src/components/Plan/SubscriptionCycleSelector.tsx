import { UncontrolledTooltip } from 'reactstrap';
import { formatCurrency } from '@helpers/currency';
import type { UserSubscribeData } from '@helpers/user';

interface SubscriptionCycleSelectorProps {
  prices: API_V1.User.PlanPriceItem[];
  selectedPrice: API_V1.User.PlanPriceItem;
  onPriceSelect: (price: API_V1.User.PlanPriceItem) => void;
  userData?: UserSubscribeData | null;
  planId: number;
}

const SubscriptionCycleSelector = ({
  prices,
  selectedPrice,
  onPriceSelect,
  userData,
  planId,
}: SubscriptionCycleSelectorProps) => {
  // 过滤价格选项
  const filteredPrices = prices.filter(price => {
    // 如果是重置流量包（type === 3 或 4），只在特定条件下显示
    // 条件：用户当前订阅的套餐与当前套餐相同，且满足流量重置条件
    if (price.type === 3 || price.type === 4) {
      const isSamePlan = userData?.analysis.currentPlanId === planId;
      return isSamePlan && (userData?.analysis.checkShouldShowTrafficReset() ?? false);
    }

    // 其他类型的价格正常显示
    return true;
  });

  return (
    <div className="row g-3">
      {filteredPrices.map(price => (
        <div key={price.id} className="col-12">
          <div
            className={`pricing-selector-item position-relative cursor-pointer rounded-3 ${
              selectedPrice?.id === price.id
                ? 'pricing-selector-item-active shadow-lg'
                : 'pricing-selector-item-inactive shadow-sm'
            }`}
            onClick={() => onPriceSelect(price)}
          >
            <div className="pa-15 pa-md-20">
              <div className="d-flex align-items-center justify-content-between">
                {/* 左侧：名称和提示 */}
                <div className="d-flex align-items-center">
                  <span
                    className={`f-fw-600 me-2 ${
                      selectedPrice?.id === price.id ? 'text-primary' : ''
                    }`}
                  >
                    {price.name}
                  </span>
                  {price.tip && (
                    <>
                      <i
                        id={`price-tip-${price.id}`}
                        className={`ph-duotone ph-info cursor-pointer small ${
                          selectedPrice?.id === price.id ? 'text-primary' : 'text-muted'
                        }`}
                      ></i>
                      <UncontrolledTooltip
                        target={`price-tip-${price.id}`}
                        placement="top"
                        transition={150}
                      >
                        {price.tip}
                      </UncontrolledTooltip>
                    </>
                  )}
                  {price.off_tip && <span className="pricing-off-badge ms-2">{price.off_tip}</span>}
                </div>

                {/* 右侧：价格和选中状态 */}
                <div className="d-flex align-items-center">
                  <span
                    className={`f-fw-600 me-2 ${
                      selectedPrice?.id === price.id ? 'text-primary' : ''
                    }`}
                  >
                    {formatCurrency(price.value)}
                  </span>
                  {selectedPrice?.id === price.id && (
                    <i className="ph-fill ph-check-circle text-primary f-s-20"></i>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionCycleSelector;
