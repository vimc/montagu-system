export const settings: Partial<Settings> = {
    showTouchstoneCreation: true,
    showNewTemplates: true,
    is2017Touchstone: (id: string) => id.indexOf("op-2017-") === 0,
    nonStochasticTouchstones: ["op-2018"]
    //isVersionOfStochasticTouchstone: function(touchstoneId: string){
    //    //is touchstone id NOT a version of any name in array of non-stochastic touchstones
    //    const nonStochasticTouchstones = ["op-2018"];
    //    return !nonStochasticTouchstones.some((ts: string) => touchstoneId.indexOf(ts) === 0);
    //},
};