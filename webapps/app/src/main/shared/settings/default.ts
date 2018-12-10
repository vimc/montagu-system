export const settings: Settings = {
    reportingApiUrl: () => "http://localhost:8081/v1",
    apiUrl: () => "http://localhost:8080/v1",
    montaguUrl: () => "http://localhost:5000",
    supportContact: "montagu-help@imperial.ac.uk",
    vimcEmail: "vimc@imperial.ac.uk",
    slackUrl: "https://vimc.slack.com/",
    teamcityServiceMessages: false,
    isApplicantTouchstone: (id: string) => id.indexOf("rfp-") > -1,
    //isStochasticTouchstone: (id: string) => id.indexOf("201804rfp") > -1,
    is2017Touchstone: (id: string) => id.indexOf("201710gavi-") === 0,
    isVersionOfStochasticTouchstone: function(touchstoneId: string){
        //is touchstone id NOT a version of any name in array of non-stochastic touchstones
        const nonStochasticTouchstones = ["201810synthetic"];
        return !nonStochasticTouchstones.some((ts: string) => touchstoneId.indexOf(ts) === 0);
    },
    showTouchstoneCreation: false,
    showOldTemplates: false,
    showNewTemplates: false,
    pinnedReports: ["other"],
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