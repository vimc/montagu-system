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
                Please return to the portal <InternalLink href="/">homepage</InternalLink> and follow instructions to find guidance on using current
                touchstones.</div>
        </PageArticle>
    }
}

export const ResponsibilityGuidanceHasMovedPage = compose(BreadcrumbInitializer)(ResponsibilityGuidanceHasMovedPageComponent) as
    React.ComponentClass<Partial<PageProperties<undefined>>>;