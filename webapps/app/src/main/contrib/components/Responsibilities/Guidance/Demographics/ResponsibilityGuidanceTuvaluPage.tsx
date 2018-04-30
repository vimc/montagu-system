import * as React from "react";
import { compose } from "recompose";

import {ChooseGroupPageComponent} from "../../../ChooseGroup/ChooseGroupPage";
import {PageBreadcrumb, PageProperties} from "../../../../../shared/components/PageWithHeader/PageWithHeader";
import {PageArticle} from "../../../../../shared/components/PageWithHeader/PageArticle";
import {BreadcrumbInitializer} from "../../../../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import {ResponsibilityGuidanceNeonatalMortalityPageComponent} from "./ResponsibilityGuidanceNeonatalMortalityPage";
import {PageScrollOnMount} from "../../../../../shared/components/PageWithHeader/PageScrollUpOnMount";

const iframeSrc = "/contribution/guidance/tuvalu_demography.html";

export class ResponsibilityGuidanceTuvaluPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ResponsibilityGuidanceNeonatalMortalityPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: "Tuvalu",
            urlFragment: "help/tuvalu/",
            parent: ChooseGroupPageComponent.breadcrumb()
        }
    }

    render() :JSX.Element {
        return <PageArticle hideTitle={true}>
            <iframe src={iframeSrc} width="100%" height="13290px" frameBorder="0"></iframe>
        </PageArticle>;
    }
}

export const ResponsibilityGuidanceTuvaluPage = compose(
    BreadcrumbInitializer,
    PageScrollOnMount
)(ResponsibilityGuidanceTuvaluPageComponent) as React.ComponentClass<Partial<PageProperties<undefined>>>;
