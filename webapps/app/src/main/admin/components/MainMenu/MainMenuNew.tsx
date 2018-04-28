import * as React from "react";

import {PageArticle} from "../../../shared/components/PageWithHeader/PageArticle";
import {PageBreadcrumb, PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import { ButtonLink } from "../../../shared/components/ButtonLink";

const menuStyles = require("./MainMenu.css");

export class MainMenu extends React.Component<PageProperties<undefined>> {

    static title: string = "Modellers' contribution portal";

    static breadcrumb() : PageBreadcrumb {
        return {
            name: MainMenu.title,
            urlFragment: "/",
            parent: null
        }
    }

    render() :JSX.Element {
        return <PageArticle title={MainMenu.title}>
            <div>
                Please select which area of Montagu you would like to manage:
                <ol className={ menuStyles.menu }>
                    <li>
                        <ButtonLink href="/modelling-groups/">Modelling groups</ButtonLink>
                    </li>
                    <li>
                        <ButtonLink href="/touchstones/">Touchstones</ButtonLink>
                    </li>
                    <li>
                        <ButtonLink href="/users/">Users and permissions</ButtonLink>
                    </li>
                </ol>
            </div>
        </PageArticle>;
    }
}