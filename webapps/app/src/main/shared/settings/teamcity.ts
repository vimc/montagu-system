export const settings: Partial<Settings> = {
    teamcityServiceMessages: true,
    is2017Touchstone: (id: string) => id.indexOf("op-2017-") === 0
};
