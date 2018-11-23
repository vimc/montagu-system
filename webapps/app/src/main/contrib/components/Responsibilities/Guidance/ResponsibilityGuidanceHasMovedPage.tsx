import * as React from "react";
import ScrollableAnchor from 'react-scrollable-anchor';
import { compose } from "recompose";

import {ChooseGroupPageComponent} from "../../ChooseGroup/ChooseGroupPage";
import { settings } from "../../../../shared/Settings";
import { InternalLink } from "../../../../shared/components/InternalLink";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {BreadcrumbInitializer} from "../../../../shared/components/Breadcrumbs/BreadcrumbsInitializer";
import {PageBreadcrumb} from "../../../../shared/components/PageWithHeader/PageProperties";

export class ResponsibilityGuidanceHasMovedPageComponent extends React.Component<PageProperties<undefined>> {
    componentDidMount(){
        this.props.createBreadcrumbs(ResponsibilityGuidanceHasMovedPageComponent.breadcrumb());
    }

    static breadcrumb() : PageBreadcrumb {
        return {
            name: "Guidance has moved",
            urlFragment: "help/model-inputs/",
            parent: ChooseGroupPageComponent.breadcrumb()
        }
    }

    render() :JSX.Element {
        return <PageArticle title="Guidance pages have moved">
            <div className="alert alert-danger">The guidance pages for models have moved.
                You can find guidance for current touchstones via the Responsibilities overview page,
                which you can access by returning to the portal <InternalLink href="/">homepage</InternalLink> and following the links.</div>
        </PageArticle>
    }
}

export const ResponsibilityGuidanceHasMovedPage = compose(BreadcrumbInitializer)(ResponsibilityGuidanceHasMovedPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;