import React from 'react';
import Table from '../lib/Table';
import dataList from './_data';
import Column from '../lib/Column';

function rangeArr(from, to) {
    const result = [];
    if (to < from) {
        [from, to] = [to, from];
    }
    for (let i = from; i <= to; i++) {
        result.push(i);
    }
    return result;
}

function min(arr) {
    return arr.reduce((result, i) => {
        return i < result ? i : result;
    }, arr[0]);
}

function max(arr) {
    return arr.reduce((result, i) => {
        return i > result ? i : result;
    }, arr[0]);
}

class TableWithSelection extends React.Component {
    state = {
        selection: [],
    };

    handleClickRow = (event, { rowIndex }) => {
        const { selection } = this.state;

        if (event.ctrlKey) {
            if (!selection.includes(rowIndex)) {
                this.setState({ selection: [...selection, rowIndex] });
            } else {
                const newSelection = selection.filter(i => i !== rowIndex);
                this.setState({ selection: [...newSelection] });
            }
        } else if (event.shiftKey && selection.length) {
            selection.push(rowIndex);
            this.setState({ selection: rangeArr(min(selection), max(selection)) });
        } else {
            this.setState({ selection: [rowIndex] });
        }
    };

    getRowClassName = rowIndex => {
        const { selection } = this.state;
        if (selection.includes(rowIndex)) {
            return 'RowSelected';
        }
    };

    render() {
        return (
            <div className="App">
                <div className="DescriptionBlock">
                    Use [<i>Ctrl</i>] and [<i>Shift</i>] keys to multi-select rows.
                </div>
                <Table
                    className="MyTable"
                    width={800}
                    height={600}
                    data={dataList}
                    onRowClick={this.handleClickRow}
                    rowClassName={this.getRowClassName}
                >
                    <Column label="c1" dataKey="c1" />
                    <Column label="c2" dataKey="c2" />
                </Table>
            </div>
        );
    }
}

export default () => <TableWithSelection />;
