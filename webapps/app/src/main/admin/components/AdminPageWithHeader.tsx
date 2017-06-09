import { PageWithHeader } from "../../shared/components/PageWithHeader/PageWithHeader";

export abstract class AdminPageWithHeader<TLocationProps> extends PageWithHeader<TLocationProps> {
    siteTitle() {
        return "Admin portal";
    }
}