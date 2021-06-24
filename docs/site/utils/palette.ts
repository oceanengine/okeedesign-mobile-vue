import * as d3 from 'd3';
import { getYSeries, query, contrastRatio } from '@byted/prism';

export function createPalette(seedColors, backgroundColor = '#fff') {
  // // 设定背景色
  // const backgroundColor = "#393a41";

  // // 设定种子色
  // const seedColors = {
  //   primary: "#338AFF",
  //   success: "#6ABF40",
  //   warning: "#FFA900",
  //   danger: "#FF9355",
  // };

  // 计算主色对比度
  const primaryContrastRatio = contrastRatio(
    d3.rgb(backgroundColor),
    d3.rgb(seedColors.primaryColor),
  );

  // 生成对比度梯度序列
  const contrastRatioList = getYSeries('curveByDesign', 11, primaryContrastRatio);

  // 主色对比度在对比度梯度中的索引
  const primaryIndex = contrastRatioList.indexOf(primaryContrastRatio);

  const colorSequences = query(
    {
      space: 'Lab', // 推荐使用 'CAM02' 和 ‘Lab’,
      backgroundColor,
      contrastRatioList,
      seedColors,
    },
    // 后处理，将生成结果中的主色修正回原始的主色，防止生成后的主色发生轻微的改变
    result => {
      result.primaryColor[primaryIndex] = [seedColors.primaryColor, primaryContrastRatio];
      return result;
    },
  );

  console.log(colorSequences);

  return colorSequences;
}

export function pickPalette(seedColors = {}, colorSequences, picked = [7, 6, 5, 3, 1]) {
  return Object.keys(seedColors)
    .map(color => {
      const currentColor = seedColors[color];
      return {
        color,
        pickedColor: [].concat(currentColor).concat(
          picked.map(index => {
            return colorSequences[color][index][0];
          }),
        ),
      };
    })
    .reduce((pre, item) => {
      return Object.assign({}, pre, {
        [item.color]: item.pickedColor,
      });
    }, {});
}
