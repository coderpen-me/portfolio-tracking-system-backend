/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const getWeightedAverage = (totalQuantity1: number, averageBuyPrice1: number, totalQuantity2: number, averageBuyPrice2: number, toBeSubstracted: boolean = false) => {
    if (toBeSubstracted) return (totalQuantity1 * averageBuyPrice1 - totalQuantity2 * averageBuyPrice2) / (totalQuantity1 - totalQuantity2);
    return (totalQuantity1 * averageBuyPrice1 + totalQuantity2 * averageBuyPrice2) / (totalQuantity1 + totalQuantity2);
};

export const updateWeightedAverage = (
    totalQuantity1: number,
    averageBuyPrice1: number,
    totalQuantity2: number,
    averageBuyPrice2: number,
    toBeRemovedQuantity: number,
    toBeRemovedAverageBuyPrice: number
) => {
    const numerator = totalQuantity1 * averageBuyPrice1 + totalQuantity2 * averageBuyPrice2 - toBeRemovedQuantity * toBeRemovedAverageBuyPrice;
    const denominator = totalQuantity1 + totalQuantity2 - toBeRemovedQuantity;
    return denominator === 0 ? 1 : numerator / denominator;
};
