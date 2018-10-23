import Table from '../lib/Table';
import dataList from './_data';
import { action } from '@storybook/addon-actions';
import Column from '../lib/Column';
import React from 'react';

export default () => {
    return (
        <div className="App">
            <Table
                className="MyTable"
                width={800}
                height={600}
                data={dataList}
                rowHeight={() => Math.floor(20 + Math.random() * 60)}
                onRowClick={action('row clicked')}
                disableHeader={false}
            >
                <Column label="c1" dataKey="c1" width={500} />
                <Column
                    label="c2"
                    dataKey="c2"
                    cellRenderer={({ dataKey, rowData }) => (
                        <div
                            className="VTCellContent"
                            style={{
                                fontWeight: 'bold',
                                backgroundColor: rowData.get('color'),
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <div>{rowData.get(dataKey)}</div>
                        </div>
                    )}
                />
                <Column label="c3" dataKey="c3" />
                <Column label="c4" dataKey="c4" />
            </Table>
        </div>
    );
};
