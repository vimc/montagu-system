declare module "alt-form" {
    import AltStore = AltJS.AltStore;

    export interface AltForm<TFields> {
        store: AltStore<TFields>;
        state: TFields;
        props: any;
        getProps: (state: any) => any;
        validate(): Promise<any>;
        save: Promise<any>;
    }

    function altForm<TFields>(name: string, alt: any, fields: any): AltForm<TFields>;
    export default altForm;
}