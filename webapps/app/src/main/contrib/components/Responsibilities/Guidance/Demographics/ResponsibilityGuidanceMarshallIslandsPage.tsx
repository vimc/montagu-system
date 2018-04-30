import * as React from "react";
import { compose } from "recompose";

import {ChooseGroupPageComponent} from "../../../ChooseGroup/ChooseGroupPage";
import {PageBreadcrumb, PageProperties} from "../../../../../shared/components/PageWithHeader/PageWithHeader";
import {BreadcrumbInitializer} from "../../../../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import {PageArticle} from "../../../../../shared/components/PageWithHeader/PageArticle";
import {PageScrollOnMount} from "../../../../../shared/components/PageWithHeader/PageScrollUpOnMount";

const iframeSrc = "/contribution/guidance/marshall_demography.html";

export class ResponsibilityGuidanceMarshallIslandsPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ResponsibilityGuidanceMarshallIslandsPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: "Marshall Islands",
            urlFragment: "help/marshall-islands/",
            parent: ChooseGroupPageComponent.breadcrumb()
        }
    }

    render() :JSX.Element {
        return <PageArticle hideTitle={true}>
            <iframe src={iframeSrc} width="100%" height="9270px" frameBorder="0"></iframe>
        </PageArticle>;
    }
}

export const ResponsibilityGuidanceMarshallIslandsPage = compose(
    BreadcrumbInitializer,
    PageScrollOnMount
)(ResponsibilityGuidanceMarshallIslandsPageComponent) as React.ComponentClass<Partial<PageProperties<undefined>>>;
