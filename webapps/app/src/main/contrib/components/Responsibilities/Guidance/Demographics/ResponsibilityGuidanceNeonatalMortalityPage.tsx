import * as React from "react";
import { compose } from "recompose";

import { ChooseGroupPageComponent } from "../../../ChooseGroup/ChooseGroupPage";
import {PageArticle} from "../../../../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../../../../shared/components/PageWithHeader/PageWithHeader";
import {BreadcrumbInitializer} from "../../../../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import {PageScrollOnMount} from "../../../../../shared/components/PageWithHeader/PageScrollUpOnMount";

const iframeSrc = "/contribution/guidance/child-mortality.html";

export class ResponsibilityGuidanceNeonatalMortalityPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ResponsibilityGuidanceNeonatalMortalityPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: "Child Mortality",
            urlFragment: "help/neonatal-mortality/",
            parent: ChooseGroupPageComponent.breadcrumb()
        }
    }

    render() :JSX.Element {
        return <PageArticle hideTitle={true}>
            <iframe src={iframeSrc} width="100%" height="2008px" frameBorder="0"></iframe>
        </PageArticle>;
    }
}

export const ResponsibilityGuidanceNeonatalMortalityPage = compose(
    BreadcrumbInitializer,
    PageScrollOnMount
)(ResponsibilityGuidanceNeonatalMortalityPageComponent) as React.ComponentClass<Partial<PageProperties<undefined>>>;
