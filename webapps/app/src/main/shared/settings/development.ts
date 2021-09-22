export const settings: Partial<Settings> = {
    showTouchstoneCreation: true,
    is2017Touchstone: (id: string) => id.indexOf("op-2017-") === 0,
    is2021GaviTouchstone: (id: string) => id.indexOf("op-2018-") === 0,
    nonStochasticTouchstones: ["op-2018"]
};
