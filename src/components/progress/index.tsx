import { CreateElement, RenderContext } from 'vue/types';
import { DefaultSlots } from '../../utils/types';

import { createNamespace } from '../../utils';

export type ProgressProps = {
  percentage: number;
  strokeHeight: number;
  trackColor?: string;
  color?: string;
  inactive: boolean;
  textInMiddle: boolean;
};

type BackgroundColorStyle = {
  backgroundColor?: string;
};

type PortionconStyle = {
  width?: string;
  height?: string;
  borderRadius: string;
};

const [createComponent, bem] = createNamespace('progress');

function Progress(
  // @ts-ignore
  h: CreateElement,
  props: ProgressProps,
  _slots: DefaultSlots,
  _ctx: RenderContext<ProgressProps>,
) {
  const { percentage, strokeHeight, trackColor, color, inactive, textInMiddle } = props;

  const finalPercentage = percentage > 100 ? 100 : percentage;

  const finalColor = inactive ? color : '';

  const semectiteBrRadius = strokeHeight / 2;

  const portionconStyle: PortionconStyle & BackgroundColorStyle = {
    width: `${finalPercentage}%`,
    borderRadius: `${semectiteBrRadius}px`,
  };

  const portionStyle: PortionconStyle & BackgroundColorStyle = {
    height: `${strokeHeight}px`,
    borderRadius: `${semectiteBrRadius}px`,
  };

  let textMiddleBgColor: BackgroundColorStyle = {};

  if (finalColor) {
    portionconStyle.backgroundColor = finalColor;
    textMiddleBgColor = {
      backgroundColor: finalColor,
    };
  }

  if (trackColor) {
    portionStyle.backgroundColor = trackColor;
  }

  return (
    <div class={bem({ 'text-in-middle': textInMiddle })}>
      <div class={bem('portion', { semectite: !inactive })} style={portionStyle}>
        <div class={bem('portioncon', { semectite: !inactive })} style={portionconStyle}>
          {textInMiddle && (
            <div class={bem('pivot-middle', { semectite: !inactive })} style={textMiddleBgColor}>
              {finalPercentage}%
            </div>
          )}
        </div>
      </div>
      {!textInMiddle && (
        <span class={bem('pivot', { semectite: !inactive })}>{finalPercentage}%</span>
      )}
    </div>
  );
}

Progress.props = {
  percentage: {
    type: Number,
    default: 50,
  },
  strokeHeight: {
    type: Number,
    default: 4,
  },
  trackColor: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  inactive: {
    type: Boolean,
    default: true,
  },
  textInMiddle: {
    type: Boolean,
    default: false,
  },
};

export default createComponent<ProgressProps>(Progress);
