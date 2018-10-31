import Table from '../lib/Table';
import { action } from '@storybook/addon-actions';
import Column from '../lib/Column';
import React from 'react';
import * as Immutable from 'immutable';

class TableWithAutoScroll extends React.Component {
    state = {
        list: new Immutable.List(),
    };

    addListItem = () => {
        const { list } = this.state;

        this.setState(
            {
                list: list.push(
                    new Immutable.Map({
                        c1: Math.random(),
                        c2: Math.random(),
                    }),
                ),
            },
            () => {
                this.addListItemTimerId = setTimeout(this.addListItem, 200);
            },
        );
    };

    componentDidMount() {
        this.addListItem();
    }

    componentWillUnmount() {
        clearTimeout(this.addListItemTimerId);
    }

    render() {
        const { list } = this.state;

        return (
            <div className="App">
                <Table
                    className="MyTable"
                    width={800}
                    height={600}
                    data={list}
                    onRowClick={action('row clicked')}
                    dynamicColumnWidth={false}
                    disableHeader={false}
                    ref={i => (this.table = i)}
                    autoScroll
                >
                    <Column label="c1" dataKey="c1" />
                    <Column label="c2" dataKey="c2" />
                </Table>
            </div>
        );
    }
}

export default () => {
    return <TableWithAutoScroll />;
};
