interface Settings {
    apiUrl: string;
    supportContact: string;
    teamcityServiceMessages: boolean;
    admin: AdminSettings;
    contrib: ContribSettings;
}

interface AppSpecificSettings {
    publicPath: string;
}

interface AdminSettings extends AppSpecificSettings {

}

interface ContribSettings extends AppSpecificSettings {

}