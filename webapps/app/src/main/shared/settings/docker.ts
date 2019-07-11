export const settings: Partial<Settings> = {
    apiUrl: () => "https://" + window.location.host + "/api/v1",
    montaguUrl: () => "https://" + window.location.host,

    admin: {
        publicPath: "/admin",
        requiresModellingGroupMembership: false
    },
    contrib: {
        publicPath: "/contribution",
        requiresModellingGroupMembership: true
    }
};
