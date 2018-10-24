import React from 'react';
import { VariableSizeList as List } from 'react-window';
import PropTypes from 'prop-types';
import * as Immutable from 'immutable';
import classNames from 'classnames';
import Header from '../Header/Header';
import Row from '../Row/Row';
import Column from '../Column/Column';

const countChildren = children => {
    let count = 0;
    React.Children.forEach(children, child => {
        if (child) {
            count += 1;
        }
    });
    return count;
};

export default class Table extends React.Component {
    state = {
        customColumnsWidth: [],
    };

    static propTypes = {
        /**
         * Table width
         */
        width: PropTypes.number.isRequired,
        /**
         * Table height
         */
        height: PropTypes.number.isRequired,
        /**
         * Table header height
         */
        headerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
        /**
         * Table row height (may be function)
         *
         * @param {Number} index Порядковый номер элемента в списке данных
         */
        rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
        /**
         * Data list
         */
        data: PropTypes.any.isRequired,
        /**
         * Row className determine function
         */
        rowClassName: PropTypes.func,
        /**
         * Personal row renderer function (If nothing return, then internal row function will be applied)
         *
         * @param {object} props
         */
        rowRenderer: PropTypes.func,
        /**
         * Sort indicator render function
         *
         * @param {object} props
         */
        sortIndicatorRenderer: PropTypes.func,
        /**
         * Mouse action on header row
         *
         * @param {SyntheticEvent} event
         * @param {object} headerCellParams Параметры ячейки заголовка
         */
        onHeaderClick: PropTypes.func,
        onHeaderDoubleClick: PropTypes.func,
        onHeaderMouseOver: PropTypes.func,
        onHeaderMouseOut: PropTypes.func,
        onHeaderRightClick: PropTypes.func,
        /**
         * Mouse action on table row
         *
         * @param {SyntheticEvent} event
         * @param {object} rowCellParams Параметры ячейки строки таблицы
         */
        onRowClick: PropTypes.func,
        onRowDoubleClick: PropTypes.func,
        onRowMouseOver: PropTypes.func,
        onRowMouseOut: PropTypes.func,
        onRowRightClick: PropTypes.func,
        /**
         * Action on table scroll
         *
         * @param {object} params
         *      @see See [React-Windows docs](https://react-window.now.sh/#/api/FixedSizeList)
         */
        onScroll: PropTypes.func,
        /**
         * Action on change column width
         *
         * @param {object} params
         */
        onResizeColumn: PropTypes.func,
        /**
         * Width of vertical table overflow
         */
        overflowWidth: PropTypes.number,
        /**
         * Minimal column width
         */
        minColumnWidth: PropTypes.number,
        /**
         * Maximum column width
         */
        maxColumnWidth: PropTypes.number,
        /**
         * Dynamic width for columns that was not resized
         */
        dynamicColumnWidth: PropTypes.bool,
        /**
         * Props for inner `react-window` list component
         * @see See [React-Windows docs](https://react-window.now.sh/#/api/FixedSizeList)
         */
        listProps: PropTypes.object,
        /**
         * No items in data list label
         */
        noItemsLabel: PropTypes.node,
        /**
         * Hide table header row
         */
        disableHeader: PropTypes.bool,
        /**
         * Optional custom CSS class name to attach to root container element
         */
        className: PropTypes.string,
        /**
         * Optional custom id to attach to root container element
         */
        id: PropTypes.string,
    };

    static defaultProps = {
        headerHeight: 30,
        rowHeight: 30,
        onHeaderClick: f => f,
        onResizeColumn: f => f,
        onRowClick: f => f,
        overflowWidth: 17,
        minColumnWidth: 30,
        dynamicColumnWidth: false,
        noItemsLabel: 'No items',
    };

    calculateCustomColumnsWidth() {
        const { children, overflowWidth, width, minColumnWidth, dynamicColumnWidth } = this.props;

        let customColumnsWidth = [];
        let customColumnsCount = 0;
        let customColumnsWidthSum = 0;

        React.Children.forEach(children, child => {
            if (!child) {
                return;
            }
            let { width } = child.props;
            if (Number.isInteger(width)) {
                width = Math.max(width, minColumnWidth);
                customColumnsCount += 1;
                customColumnsWidthSum += width;
            }
            customColumnsWidth.push(width || undefined);
        });

        if (!dynamicColumnWidth) {
            //Fill other width averaged width values
            const defaultWidth = Math.max(
                (width - overflowWidth - customColumnsWidthSum) / (this.getColumnsCount() - customColumnsCount),
                minColumnWidth,
            );
            customColumnsWidth = customColumnsWidth.map(item => {
                if (item === undefined) {
                    return defaultWidth;
                }
                return item;
            });
        }

        return customColumnsWidth;
    }

    componentDidUpdate(prevProps) {
        if (countChildren(prevProps.children) !== countChildren(this.props.children)) {
            this.setState({
                customColumnsWidth: this.calculateCustomColumnsWidth(),
            });
        }
    }

    constructor(props) {
        super(props);

        this.state.customColumnsWidth = this.calculateCustomColumnsWidth();
    }

    getColumnsCount() {
        const { children } = this.props;

        let total = 0;
        React.Children.forEach(children, child => {
            if (child && child.type === Column) {
                total += 1;
            }
        });
        return total;
    }

    componentDidMount() {
        const { disableHeader } = this.props;

        if (!disableHeader) {
            this.listOuter &&
                this.listOuter.addEventListener('scroll', e => {
                    this.header.headerEl.scrollLeft = e.target.scrollLeft;
                });
        }
    }

    getColumnWidth = columnIndex => {
        const { width, overflowWidth, minColumnWidth, dynamicColumnWidth } = this.props;
        const { customColumnsWidth } = this.state;

        if (!dynamicColumnWidth) {
            return customColumnsWidth[columnIndex];
        }

        if (customColumnsWidth[columnIndex]) {
            return customColumnsWidth[columnIndex];
        }

        let customColumnsWidthSum = 0;
        let customColumnsCount = 0;
        customColumnsWidth.forEach(item => {
            if (item) {
                customColumnsCount += 1;
                customColumnsWidthSum += item;
            }
        });

        return Math.max(
            (width - overflowWidth - customColumnsWidthSum) / (this.getColumnsCount() - customColumnsCount),
            minColumnWidth,
        );
    };

    getRowHeight = index => {
        const { rowHeight } = this.props;
        if (typeof rowHeight === 'function') {
            return rowHeight(index);
        }
        return rowHeight;
    };

    getEstimatedItemSize = () => {
        const { data } = this.props;
        const total = data.reduce((total, item, idx) => {
            return total + this.getRowHeight(idx);
        }, 0);
        return Math.floor(total / this.getDataSize());
    };

    getHeaderHeight = () => {
        const { headerHeight, disableHeader } = this.props;
        if (disableHeader) {
            return 0;
        }

        if (typeof headerHeight === 'function') {
            return headerHeight();
        }
        return headerHeight;
    };

    getRowData = index => {
        const { data } = this.props;
        if (Immutable.Iterable.isIterable(data)) {
            return data.get(index);
        } else {
            return data[index];
        }
    };

    getCellValue = ({ rowData, dataKey }) => {
        if (Immutable.Iterable.isIterable(rowData)) {
            return rowData.get(dataKey);
        } else {
            return rowData[dataKey];
        }
    };

    getDataSize = () => {
        const { data } = this.props;

        if (Immutable.Iterable.isIterable(data)) {
            return data.size;
        } else {
            return data.length;
        }
    };

    getRowWidth = () => {
        const { customColumnsWidth } = this.state;
        return customColumnsWidth.reduce((result, item, idx) => result + this.getColumnWidth(idx), 0);
    };

    handleResizeColumn = (columnIndex, diff, dataKey) => {
        const { minColumnWidth, maxColumnWidth, onResizeColumn } = this.props;
        const { customColumnsWidth } = this.state;
        const columnWidth = this.getColumnWidth(columnIndex);
        const newCustomColumnsWidth = [...customColumnsWidth];
        let newWidth = Math.max(columnWidth + diff, minColumnWidth);
        if (maxColumnWidth) {
            newWidth = Math.min(newCustomColumnsWidth[columnIndex], maxColumnWidth);
        }
        newCustomColumnsWidth[columnIndex] = newWidth;

        this.setState({
            customColumnsWidth: newCustomColumnsWidth,
        });

        this.list && this.list.resetAfterIndex(0);

        onResizeColumn({ dataKey, columnIndex, resizeDiff: diff, newWidth });
    };

    scrollTo(...args) {
        this.list && this.list.scrollTo(...args);
    }

    scrollToItem(...args) {
        this.list && this.list.scrollToItem(...args);
    }

    renderHeader() {
        const { children, disableHeader, headerHeight, sortIndicatorRenderer } = this.props;

        if (disableHeader) {
            return null;
        }

        const componentProps = {
            children: children,
            height: headerHeight,
            getColumnWidth: this.getColumnWidth,
            getHeaderHeight: this.getHeaderHeight,
            onResizeColumn: this.handleResizeColumn,
            onClick: this.props.onHeaderClick,
            onDoubleClick: this.props.onHeaderDoubleClick,
            onMouseOver: this.props.onHeaderMouseOver,
            onMouseOut: this.props.onHeaderMouseOut,
            onRightClick: this.props.onHeaderRightClick,
            sortIndicatorRenderer: sortIndicatorRenderer,
            ref: i => (this.header = i),
        };

        return <Header {...componentProps} />;
    }

    getRowHandler = actionType => {
        if (!this[`handleRow${actionType}`]) {
            this[`handleRow${actionType}`] = event => {
                const action = this.props[`onRow${actionType}`];
                if (action) {
                    const rowIndex = Number(event.currentTarget.dataset.rowIndex);
                    const rowData = this.getRowData(rowIndex);
                    action(event, { rowIndex, rowData });
                }
            };
        }
        return this[`handleRow${actionType}`];
    };

    renderRow() {
        const { rowClassName, children, rowRenderer } = this.props;

        const componentProps = {
            children: children,
            rowClassName,
            getRowWidth: this.getRowWidth,
            getCellValue: this.getCellValue,
            getColumnWidth: this.getColumnWidth,
            onClick: this.getRowHandler('Click'),
            onDoubleClick: this.getRowHandler('DoubleClick'),
            onMouseOver: this.getRowHandler('MouseOver'),
            onMouseOut: this.getRowHandler('MouseOut'),
            onMouseDown: this.getRowHandler('MouseDown'),
            onMouseUp: this.getRowHandler('MouseUp'),
            onRightClick: this.getRowHandler('RightClick'),
        };

        const RowComponent = rowRenderer ? rowRenderer : Row;

        return props => {
            const style = { ...props.style, width: this.getRowWidth() };
            const rowData = this.getRowData(props.index);
            return <RowComponent {...{ ...props, style, rowData, ...componentProps }} />;
        };
    }

    renderNoItemsLabel() {
        const { noItemsLabel } = this.props;

        return <div className="VTNoItemsLabel">{noItemsLabel}</div>;
    }

    render() {
        const { height, width, listProps, className, onScroll } = this.props;

        return (
            <div
                className={classNames('VTContainer', className)}
                style={{ paddingTop: this.getHeaderHeight(), width: width, height: height - this.getHeaderHeight() }}
            >
                {this.renderHeader()}

                {this.getDataSize() ? (
                    <List
                        ref={i => (this.list = i)}
                        innerRef={i => (this.listInner = i)}
                        outerRef={i => (this.listOuter = i)}
                        className="VTList"
                        height={height - this.getHeaderHeight()}
                        itemCount={this.getDataSize()}
                        itemSize={this.getRowHeight}
                        width={width}
                        onScroll={onScroll}
                        estimatedItemSize={this.getEstimatedItemSize()}
                        {...listProps}
                    >
                        {this.renderRow()}
                    </List>
                ) : (
                    this.renderNoItemsLabel()
                )}
            </div>
        );
    }
}
