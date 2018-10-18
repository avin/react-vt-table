import React from 'react';
import PropTypes from 'prop-types';

export default class Column extends React.Component {
    static propTypes = {
        /**
         * Content cell render function
         */
        cellRenderer: PropTypes.func,
        /**
         * Column header cell render function
         */
        columnHeaderCellRenderer: PropTypes.func,
        /**
         * Field key containing data
         */
        dataKey: PropTypes.string,
        /**
         * Default column width in pixels
         */
        width: PropTypes.number,
    };

    render() {
        return <span />;
    }
}
