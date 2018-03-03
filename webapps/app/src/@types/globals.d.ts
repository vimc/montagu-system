declare var __webpack_public_path__: string;

declare module '*.css' { const content: any; export default content; }
declare module '*.scss' { const content: any; export default content; }

declare module '*.png';
declare module '*.gif';

declare type ComponentConstructor<TProps, TState> = new (...args: any[]) => React.Component<TProps, TState>;

declare module 'js-base64';
declare module 'appName';
declare module 'lodash';
declare module 'react-day-picker/DayPickerInput';
declare module 'react-day-picker/moment';
declare module 'reselect';
declare module '@hocs/with-lifecycle';
