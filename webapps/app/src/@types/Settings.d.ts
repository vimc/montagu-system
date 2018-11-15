interface Settings {
    reportingApiUrl: () => string;
    apiUrl: () => string;
    montaguUrl: () => string;
    supportContact: string;
    vimcEmail: string;
    slackUrl: string;
    isApplicantTouchstone: (id: string) => boolean;
    isStochasticTouchstone: (id: string) => boolean;
    teamcityServiceMessages: boolean;
    admin: AdminSettings;
    contrib: ContribSettings;
    report: ReportSettings;
    showTouchstoneCreation: boolean;
    showNewTemplates: boolean;
    showOldTemplates: boolean;
    pinnedReports: string[];
}

interface AppSpecificSettings {
    publicPath: string;
    requiresModellingGroupMembership: boolean;
}

interface AdminSettings extends AppSpecificSettings {

}

interface ContribSettings extends AppSpecificSettings {

}

interface ReportSettings extends AppSpecificSettings {

}