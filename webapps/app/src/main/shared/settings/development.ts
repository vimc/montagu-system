export const settings: Partial<Settings> = {
    showTouchstoneCreation: true,
    showNewTemplates: true,
    is2017Touchstone: (id: string) => id.indexOf("op-2017-") === 0
};