export const settings: Settings = {
    apiUrl: () => "https://" + window.location.host + "/api/v1",
    supportContact: "t.garske@imperial.ac.uk",
    teamcityServiceMessages: false,
    admin: {
        publicPath: "/admin"
    },
    contrib: {
        publicPath: "/contribution"
    }
};