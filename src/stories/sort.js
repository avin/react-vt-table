import React from 'react';
import Table from '../lib/Table';
import dataList from './data';
import Column from '../lib/Column';

export function multiSort(list, keys) {
    let k = 0;
    keys.forEach(({ key, order }) => {
        list = list.sort((a, b) => {
            let ok = true;
            for (let m = 0; m < k; m += 1) {
                if (a.get(keys[m].key).localeCompare(b.get(keys[m].key)) !== 0) {
                    ok = false;
                }
            }
            if (ok) {
                const orderFactor = order === 'DESC' ? -1 : 1;
                return a.get(key).localeCompare(b.get(key)) * orderFactor;
            } else {
                return 0;
            }
        });

        k += 1;
    });

    return list;
}

class TableWithSorting extends React.Component {
    state = {
        sortingKeys: [{ key: 'c1', order: 'ASC' }],
    };

    getSortedData() {
        const { sortingKeys } = this.state;
        return multiSort(dataList, sortingKeys);
    }

    handleClickHeader = (event, { dataKey }) => {
        let { sortingKeys } = this.state;

        const columnSortingIndex = sortingKeys.findIndex(i => i.key === dataKey);
        if (event.ctrlKey) {
            if (columnSortingIndex >= 0) {
                sortingKeys[columnSortingIndex] = {
                    key: dataKey,
                    order: sortingKeys[columnSortingIndex]['order'] === 'ASC' ? 'DESC' : 'ASC',
                };
            } else {
                sortingKeys.push({
                    key: dataKey,
                    order: 'ASC',
                });
            }
        } else {
            let order = 'ASC';
            if (columnSortingIndex >= 0) {
                order = sortingKeys[columnSortingIndex].order === 'ASC' ? 'DESC' : 'ASC';
            }

            sortingKeys = [
                {
                    key: dataKey,
                    order,
                },
            ];
        }

        this.setState({ sortingKeys: [...sortingKeys] });
    };

    sortIndicatorRender = ({ dataKey, columnIndex }) => {
        const { sortingKeys } = this.state;
        const columnSortingIndex = sortingKeys.findIndex(i => i.key === dataKey);
        const columnSorting = sortingKeys[columnSortingIndex];

        if (columnSorting) {
            return columnSorting.order === 'ASC' ? (
                <div className="SortIndicator ASC" style={{ opacity: 1 - columnSortingIndex / 4 }} />
            ) : (
                <div className="SortIndicator DESC" style={{ opacity: 1 - columnSortingIndex / 4 }} />
            );
        }
        return null;
    };

    render() {
        return (
            <div className="App">
                <p>Click on header's cells to sort data. Use [<i>Ctrl</i>] to multi-sort.</p>
                <Table
                    className="MyTable"
                    width={800}
                    height={600}
                    data={this.getSortedData()}
                    onHeaderClick={this.handleClickHeader}
                    onRowClick={this.handleClickRow}
                    rowClassName={this.getRowClassName}
                    sortIndicatorRenderer={this.sortIndicatorRender}
                >
                    <Column label="c1" dataKey="c1" />
                    <Column label="c2" dataKey="c2" />
                    <Column label="c3" dataKey="c3" />
                    <Column label="c4" dataKey="c4" />
                </Table>
            </div>
        );
    }
}

export default () => <TableWithSorting />;
