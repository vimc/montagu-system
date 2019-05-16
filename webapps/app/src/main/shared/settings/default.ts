export const settings: Settings = {
    reportingApiUrl: () => "http://localhost:8081/v1",
    apiUrl: () => "http://localhost:8080/v1",
    montaguUrl: () => "http://localhost",
    supportContact: "montagu-help@imperial.ac.uk",
    vimcEmail: "vimc@imperial.ac.uk",
    slackUrl: "https://vimc.slack.com/",
    teamcityServiceMessages: false,
    isApplicantTouchstone: (id: string) => id.indexOf("rfp-") > -1,
    is2017Touchstone: (id: string) => id.indexOf("201710gavi-") === 0,
    nonStochasticTouchstones: ["201810synthetic"],
    isVersionOfStochasticTouchstone: function(touchstoneId: string){
        //is touchstone id NOT a version of any name in array of non-stochastic touchstones
        return !this.nonStochasticTouchstones.some((ts: string) => touchstoneId.indexOf(ts) === 0);
    },
    showTouchstoneCreation: false,
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
    },
    test: {
        publicPath: "/",
        requiresModellingGroupMembership: false
    }
};