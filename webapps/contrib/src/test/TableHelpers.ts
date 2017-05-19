import { ShallowWrapper } from "enzyme";

export function findLabelledCell(wrapper: ShallowWrapper<any, any>, label: string): ShallowWrapper<any, any> {
    const rows = wrapper.find("tr");
    const cells = rows
        .filterWhere(row => row.childAt(0).text() == label)
        .map(row => row.childAt(1));
    if (cells.length == 0) {
        throw Error(`Unable to find label cell (i.e. first cell in a row) with text '${label}'`);
    } else {
        return cells[0];
    }
}