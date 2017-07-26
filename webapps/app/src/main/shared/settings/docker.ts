export const settings: Settings = {
    reportingApiUrl: () => "https://" + window.location.host + "/reports/api/v1",
    apiUrl: () => "https://" + window.location.host + "/api/v1",
    supportContact: "t.garske@imperial.ac.uk",
    teamcityServiceMessages: false,
    admin: {
        publicPath: "/admin",
        requiresModellingGroupMembership: false
    },
    contrib: {
        publicPath: "/contribution",
        requiresModellingGroupMembership: true
    },
    report: {
        publicPath: "/reporting",
        requiresModellingGroupMembership: false
    }
};