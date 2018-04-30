import * as React from "react";
import { compose } from "recompose";

import { ChooseGroupPageComponent } from "../../../ChooseGroup/ChooseGroupPage";
import {PageArticle} from "../../../../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../../../../shared/components/PageWithHeader/PageWithHeader";
import {BreadcrumbInitializer} from "../../../../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import {PageScrollOnMount} from "../../../../../shared/components/PageWithHeader/PageScrollUpOnMount";

const iframeSrc = "/contribution/guidance/kosovo_demography.html";

export class ResponsibilityGuidanceKosovoPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ResponsibilityGuidanceKosovoPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: "Kosovo",
            urlFragment: "help/kosovo/",
            parent: ChooseGroupPageComponent.breadcrumb()
        }
    }

    render() :JSX.Element {
        return <PageArticle hideTitle={true}>
            <iframe src={iframeSrc} width="100%" height="12231px" frameBorder="0"></iframe>
        </PageArticle>;
    }
}

export const ResponsibilityGuidanceKosovoPage = compose(
    BreadcrumbInitializer,
    PageScrollOnMount
)(ResponsibilityGuidanceKosovoPageComponent) as React.ComponentClass<Partial<PageProperties<undefined>>>;
