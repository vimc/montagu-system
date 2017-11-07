export const settings: Settings = {
    reportingApiUrl: () => "http://localhost:8081/v1",
    apiUrl: () => "http://localhost:8080/v1",
    montaguUrl: () => "http://localhost:5000/",
    supportContact: "montagu-help@imperial.ac.uk",
    teamcityServiceMessages: false,
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