interface Settings {
    apiUrl: () => string;
    montaguUrl: () => string;
    supportContact: string;
    vimcEmail: string;
    slackUrl: string;
    isApplicantTouchstone: (id: string) => boolean;
    is2017Touchstone: (id: string) => boolean;
    is2019Touchstone: (id: string) => boolean;
    is2021TestTouchstone: (id: string) => boolean;
    is2021GaviTouchstone: (id: string) => boolean;
    isNoGuidanceTouchstone: (id: string) => boolean;
    isVersionOfStochasticTouchstone: (touchstoneId: string) => boolean;
    nonStochasticTouchstones: string[],
    admin: AdminSettings;
    contrib: ContribSettings;
    test: AppSpecificSettings;
    showTouchstoneCreation: boolean;
    hideWideFormat: (disease: string, touchstone: string) => boolean;
}

interface AppSpecificSettings {
    publicPath: string;
    requiresModellingGroupMembership: boolean;
}

interface AdminSettings extends AppSpecificSettings {

}

interface ContribSettings extends AppSpecificSettings {

}
