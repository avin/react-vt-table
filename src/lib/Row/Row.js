import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

export default class Row extends React.PureComponent {
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
        children: PropTypes.array,
        /**
         * Row className determine function
         */
        rowClassName: PropTypes.func,
        /**
         * Function to get cell value
         */
        getCellValue: PropTypes.func,
        /**
         * Function to get column width
         */
        getColumnWidth: PropTypes.func,
        /**
         *  Mouse actions
         */
        onClick: PropTypes.func,
        onDoubleClick: PropTypes.func,
        onMouseOver: PropTypes.func,
        onMouseOut: PropTypes.func,
        onMouseDown: PropTypes.func,
        onMouseUp: PropTypes.func,
        onRightClick: PropTypes.func,
    };
    render() {
        let { data, index, style } = this.props;

        let {
            dataList,
            getRowData,
            rowClassName,
            getCellValue,
            getColumnWidth,
            children,
            onClick,
            onDoubleClick,
            onMouseOver,
            onMouseOut,
            onMouseDown,
            onMouseUp,
            onRightClick,
        } = data.rowProps;

        const evenClassName = index % 2 === 0 ? 'VTRowOdd' : 'VTRowEven';
        const customClassName = rowClassName && rowClassName(index);

        const rowData = getRowData(index, dataList);

        let idx = 0;
        return (
            <div
                className={classNames('VTRow', evenClassName, customClassName)}
                style={style}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onContextMenu={onRightClick}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                data-row-index={index}
            >
                {React.Children.map(children, child => {
                    if (!child) {
                        return null;
                    }
                    const { cellRenderer, dataKey } = child.props;
                    const width = getColumnWidth(idx);

                    let content;
                    if (cellRenderer) {
                        content = cellRenderer({ dataKey, rowData, columnIndex: idx });
                    } else {
                        const contentStr = getCellValue({ rowData, dataKey });
                        content = (
                            <div className="VTCellContent" title={contentStr}>
                                {contentStr}
                            </div>
                        );
                    }

                    idx += 1;
                    return (
                        <div className="VTCell" style={{ minWidth: width, maxWidth: width }}>
                            {content}
                        </div>
                    );
                })}
            </div>
        );
    }
}
