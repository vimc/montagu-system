export const settings: Partial<Settings> = {
    reportingApiUrl: () => "https://" + window.location.host + "/reports/api/v1",
    apiUrl: () => "https://" + window.location.host + "/api/v1",
    montaguUrl: () => "https://" + window.location.host,

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
    showNewTemplates: true,
    pinnedReports: ["modup2-201807", "vaccine-impact-dataset"]
};