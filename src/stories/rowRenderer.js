import Table from '../lib/Table';
import dataList from './_data';
import { action } from '@storybook/addon-actions';
import Column from '../lib/Column';
import React from 'react';

const rowRenderer = ({ index, style }) => {
    if (index % 10 === 0) {
        return (
            <div {...{ style: { ...style, lineHeight: style.height + 'px' } }} className="CustomRow">
                This is #{index / 10 + 1} row rendered by custom renderer!
            </div>
        );
    }
};

export default () => {
    return (
        <div className="App">
            <Table
                className="MyTable"
                width={800}
                height={600}
                data={dataList}
                rowRenderer={rowRenderer}
                onRowClick={action('row clicked')}
                dynamicColumnWidth={false}
                disableHeader={false}
            >
                <Column label="c1" dataKey="c1" width={500} />
                <Column
                    label="c2"
                    dataKey="c2"
                    cellRenderer={({ dataKey, rowData }) => (
                        <div
                            className="VTCellContent"
                            style={{ fontWeight: 'bold', backgroundColor: rowData.get('color') }}
                        >
                            {rowData.get(dataKey)}
                        </div>
                    )}
                />
                <Column label="c3" dataKey="c3" />
                <Column label="c4" dataKey="c4" />
            </Table>
        </div>
    );
};
