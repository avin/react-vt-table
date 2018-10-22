import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export default class Row extends React.Component {
    static propTypes = {
        /**
         * Row index number
         */
        index: PropTypes.number,
        /**
         * Row style object
         */
        style: PropTypes.object,
        /**
         * Table columns array
         */
        columns: PropTypes.array,
        /**
         * Row className determine function
         */
        rowClassName: PropTypes.func,
        /**
         * Function to get cell value
         */
        getDataRowItem: PropTypes.func,
        /**
         * Function to get column width
         */
        getColumnWidth: PropTypes.func,
        /**
         * Function to get row data item
         */
        getDataRow: PropTypes.func,
        /**
         *  Mouse actions
         */
        onClick: PropTypes.func,
        onDoubleClick: PropTypes.func,
        onMouseOver: PropTypes.func,
        onMouseOut: PropTypes.func,
        onRightClick: PropTypes.func,
    };
    render() {
        let { index, rowClassName, style, getDataRow, getDataRowItem, getColumnWidth, columns } = this.props;

        const rowData = getDataRow(index);

        const evenClassName = index % 2 === 0 ? 'VTRowOdd' : 'VTRowEven';
        const customClassName = rowClassName && rowClassName(index);

        return (
            <div className={classNames('VTRow', evenClassName, customClassName)} style={style}>
                {columns.map((child, idx) => {
                    const { cellRenderer, dataKey } = child.props;
                    const width = getColumnWidth(idx);

                    let content;
                    if (cellRenderer) {
                        content = cellRenderer({ dataKey, rowData, columnIndex: idx });
                    } else {
                        const contentStr = getDataRowItem({ rowData, dataKey });
                        content = (
                            <div
                                className="VTCellContent"
                                title={contentStr}
                                style={{ lineHeight: style.height + 'px' }}
                            >
                                {contentStr}
                            </div>
                        );
                    }

                    const getAction = actionName => {
                        const action = this.props[actionName];
                        if (action) {
                            return event => action(event, { rowIndex: index, dataKey, columnIndex: idx });
                        }
                    };

                    return (
                        <div
                            className="VTCell"
                            style={{ minWidth: width, maxWidth: width }}
                            onClick={getAction('onClick')}
                            onDoubleClick={getAction('onDoubleClick')}
                            onMouseOver={getAction('onMouseOver')}
                            onMouseOut={getAction('onMouseOut')}
                            onContextMenu={getAction('onRightClick')}
                        >
                            {content}
                        </div>
                    );
                })}
            </div>
        );
    }
}
