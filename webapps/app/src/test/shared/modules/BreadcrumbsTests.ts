import { expect } from "chai";
import {breadcrumbsModule} from "../../../main/shared/modules/breadcrumbs";

describe('Breadcrumbs Module Tests', () => {
    test('initializes empty array if null passed', () => {
        expect(breadcrumbsModule.initialize(null)).to.eql([]);
    });

    test('initializes breadcrumb with one element', () => {
        expect(breadcrumbsModule.initialize({
            name: 'A',
            urlFragment: '/',
            parent: null
        })).to.eql([{
            name: 'A',
            url: '/',
        }]);
    });

    test('initializes breadcrumb with one element', () => {
        expect(breadcrumbsModule.initialize({
            name: 'A',
            urlFragment: '/',
            parent: null
        })).to.eql([{
            name: 'A',
            url: '/',
        }]);
    });

    test('reformats from tree to array', () => {
        expect(breadcrumbsModule.getParentsInOrderFromTopToBottom({
            name: 'B',
            urlFragment: 'b/',
            parent: {
                name: 'A',
                urlFragment: '/',
                parent: null
            }
        })).to.eql([{
            name: 'A',
            urlFragment: '/',
            parent: null
        },{
            name: 'B',
            urlFragment: 'b/',
            parent: {
                name: 'A',
                urlFragment: '/',
                parent: null
            }
        }]);
    });

    test('creates url adding all url fragments', () => {
        expect(breadcrumbsModule.url({
            name: 'B',
            urlFragment: 'b/',
            parent: {
                name: 'A',
                urlFragment: '/',
                parent: null
            }
        })).to.equal("/b/");
    });
});