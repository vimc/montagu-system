export const settings: Settings = {
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
    }
};