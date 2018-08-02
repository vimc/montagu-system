export const settings: Settings = {
    reportingApiUrl: () => "http://localhost:8081/v1",
    apiUrl: () => "http://localhost:8080/v1",
    montaguUrl: () => "http://localhost:5000",
    supportContact: "montagu-help@imperial.ac.uk",
    vimcEmail: "vimc@imperial.ac.uk",
    slackUrl: "https://vimc.slack.com/",
    teamcityServiceMessages: false,
    isApplicantTouchstone: (id: string) => id.indexOf("rfp-") > -1,
    isStochasticTouchstone: (id: string) => id.indexOf("201804rfp") > -1,
    showTouchstoneCreation: false,
    useNewTemplates: true,
    admin: {
        publicPath: "/admin",
        requiresModellingGroupMembership: false
    },
    contrib: {
        publicPath: "/contribution",
        requiresModellingGroupMembership: true
    },
    report: {
        publicPath: "/reports",
        requiresModellingGroupMembership: false
    }
};