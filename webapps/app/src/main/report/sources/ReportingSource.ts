import {FetchConfig, Source, UrlBuilder} from "../../shared/sources/Source";
import {makeNotificationException, notificationActions} from "../../shared/actions/NotificationActions";
import {ReportingFetcher} from "./ReportingFetcher";
import fetcher from "../../shared/sources/Fetcher";

export abstract class ReportingSource<TState> extends Source<TState> {
    protected fetchRemoteData(url: string) {
        return (<ReportingFetcher>fetcher.fetcher).fetchFromReportingApi(url);
    }
}