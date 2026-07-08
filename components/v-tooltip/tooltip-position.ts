const VIEWPORT_MARGIN_PX = 8;
const TRIGGER_GAP_PX = 8;

export interface TooltipPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom';
}

export function computeTooltipPosition(triggerRect: DOMRect, panelRect: DOMRect): TooltipPosition {
  const fitsAbove = triggerRect.top - panelRect.height - TRIGGER_GAP_PX >= VIEWPORT_MARGIN_PX;
  const top = fitsAbove ? triggerRect.top - panelRect.height - TRIGGER_GAP_PX : triggerRect.bottom + TRIGGER_GAP_PX;

  const idealLeft = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
  const maxLeft = window.innerWidth - panelRect.width - VIEWPORT_MARGIN_PX;
  const left = Math.min(Math.max(idealLeft, VIEWPORT_MARGIN_PX), Math.max(maxLeft, VIEWPORT_MARGIN_PX));

  return { top, left, placement: fitsAbove ? 'top' : 'bottom' };
}
