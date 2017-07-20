export const settings: Settings = {
    reportingApiUrl: () => "http://localhost:8081/v1",
    apiUrl: () => "http://localhost:8080/v1",
    supportContact: "t.garske@imperial.ac.uk",
    teamcityServiceMessages: true,
    admin: {
        publicPath: "",
        requiresModellingGroupMembership: false
    },
    contrib: {
        publicPath: "",
        requiresModellingGroupMembership: true
    },
    report: {
        publicPath: "",
        requiresModellingGroupMembership: false
    }
};