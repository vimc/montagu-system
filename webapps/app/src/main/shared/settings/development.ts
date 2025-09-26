export const settings: Partial<Settings> = {
    showTouchstoneCreation: true,
    is2017Touchstone: (id: string) => id.indexOf("op-2017-") === 0,
    isLatestGuidanceTouchstone: (id: string) => id.indexOf("op-2018-") === 0
};
