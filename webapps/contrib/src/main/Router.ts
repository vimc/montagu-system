import { Component } from 'react'
import { Router, RouteMap } from 'simple-react-router'

// Pages
import { ResponsibilityOverviewPage } from './components/Responsibilities/ResponsibilityOverviewPage';
import { ChooseTouchstonePage } from './components/Touchstones/ChooseTouchstonePage';

export default class AppRouter extends Router {
    routes(map: RouteMap) {
        map('/', ChooseTouchstonePage);
        map('/responsibilities/:touchstoneId', ResponsibilityOverviewPage);
        //map('/:path*', OtherPage) // catchall route 
    }
}