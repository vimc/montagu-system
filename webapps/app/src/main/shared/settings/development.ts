export const settings: Partial<Settings> = {
    showTouchstoneCreation: true,
    is2017Touchstone: (id: string) => id.indexOf("op-2017-") === 0,
    is2019Touchstone: (id: string) => true,
    nonStochasticTouchstones: ["op-2018"]
};