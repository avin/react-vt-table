import Table from '../lib/Table';
import dataList from './_data';
import { action } from '@storybook/addon-actions';
import Column from '../lib/Column';
import React from 'react';

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class TableWithScrollButton extends React.Component {
    scrollToRandomElement = () => {
        this.table.scrollToItem(randomBetween(0, dataList.size));
    };

    scrollToRandomOffset = () => {
        const scrollHeight = this.table.listOuter.scrollHeight;
        this.table.scrollTo(randomBetween(0, scrollHeight));
    };

    render() {
        return (
            <div className="App">
                <div className="DescriptionBlock">
                    <button type="button" onClick={this.scrollToRandomElement}>
                        Scroll to random element
                    </button>

                    <button type="button" onClick={this.scrollToRandomOffset}>
                        Scroll to random offset
                    </button>
                </div>

                <Table
                    className="MyTable"
                    width={800}
                    height={600}
                    data={dataList}
                    onRowClick={action('row clicked')}
                    dynamicColumnWidth={false}
                    disableHeader={false}
                    ref={i => (this.table = i)}
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
    }
}

export default () => {
    return <TableWithScrollButton />;
};
