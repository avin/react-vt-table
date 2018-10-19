import React from 'react';
import { VariableSizeList as List } from 'react-window';
import PropTypes from 'prop-types';
import * as Immutable from 'immutable';
import classNames from 'classnames';
import ColumnResizer from '../ColumnResizer';

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
        data: PropTypes.oneOfType([PropTypes.instanceOf(Immutable.Iterable), PropTypes.arrayOf(PropTypes.object)])
            .isRequired,
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
        onHeaderHeaderMouseOver: PropTypes.func,
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

    constructor(props) {
        super(props);
        const { children, overflowWidth, width, minColumnWidth, dynamicColumnWidth } = this.props;

        let customColumnsWidth = [];
        let customColumnsCount = 0;
        let customColumnsWidthSum = 0;

        React.Children.forEach(children, (child, idx) => {
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
                (width - overflowWidth - customColumnsWidthSum) / (React.Children.count(children) - customColumnsCount),
                minColumnWidth,
            );
            customColumnsWidth = customColumnsWidth.map(item => {
                if (item === undefined) {
                    return defaultWidth;
                }
                return item;
            });
        }
        this.state.customColumnsWidth = customColumnsWidth;
    }

    componentDidMount() {
        const { disableHeader } = this.props;

        if (!disableHeader) {
            this.listOuterEl &&
                this.listOuterEl.addEventListener('scroll', e => {
                    this.headerEl.scrollLeft = e.target.scrollLeft;
                });
        }
    }

    getColumnWidth = columnIndex => {
        const { children, width, overflowWidth, minColumnWidth, dynamicColumnWidth } = this.props;
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
            (width - overflowWidth - customColumnsWidthSum) / (React.Children.count(children) - customColumnsCount),
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

    getDataRow(index) {
        const { data } = this.props;
        if (data instanceof Immutable.Iterable) {
            return data.get(index);
        } else {
            return data[index];
        }
    }

    getDataRowItem(rowData, dataKey) {
        if (rowData instanceof Immutable.Map) {
            return rowData.get(dataKey);
        } else {
            return rowData[dataKey];
        }
    }

    getDataSize() {
        const { data } = this.props;

        if (data instanceof Immutable.Iterable) {
            return data.size;
        } else {
            return data.length;
        }
    }

    getRowWidth() {
        const { customColumnsWidth } = this.state;
        return customColumnsWidth.reduce((result, item) => result + item, 0);
    }

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
        this.list.scrollTo(...args);
    }

    scrollToItem(...args) {
        this.list.scrollToItem(...args);
    }

    renderHeaderSortIndicator(columnComponent, columnIndex) {
        const { dataKey } = columnComponent.props;
        const { sortIndicatorRenderer } = this.props;
        if (sortIndicatorRenderer) {
            return sortIndicatorRenderer({ dataKey, columnIndex });
        }
    }

    renderHeader() {
        const { children, disableHeader, headerHeight } = this.props;
        if (disableHeader) {
            return null;
        }

        return (
            <div className="VTHeader" style={{ height: this.getHeaderHeight() }} ref={i => (this.headerEl = i)}>
                {React.Children.map(children, (child, idx) => {
                    let { label, dataKey, columnHeaderCellRenderer } = child.props;
                    const width = this.getColumnWidth(idx);

                    let content;
                    if (columnHeaderCellRenderer) {
                        content = columnHeaderCellRenderer({ label, dataKey, columnIndex: idx });
                    } else {
                        content = (
                            <div className="VTCellContent" title={label} style={{ lineHeight: headerHeight + 'px' }}>
                                {label}
                            </div>
                        );
                    }

                    const getAction = actionName => {
                        const action = this.props[actionName];
                        if (action) {
                            return event => action(event, { dataKey, columnIndex: idx });
                        }
                    };

                    return (
                        <div
                            className="VTHeaderCell"
                            style={{ minWidth: width, maxWidth: width }}
                            onClick={getAction('onHeaderClick')}
                            onDoubleClick={getAction('onHeaderDoubleClick')}
                            onMouseOver={getAction('onHeaderHeaderMouseOver')}
                            onMouseOut={getAction('onHeaderMouseOut')}
                            onContextMenu={getAction('onHeaderRightClick')}
                        >
                            {content}

                            <ColumnResizer onResizeColumn={diff => this.handleResizeColumn(idx, diff, dataKey)} />

                            {this.renderHeaderSortIndicator(child, idx)}
                        </div>
                    );
                })}
                <div className="VTHeaderCell" style={{ minWidth: 17, maxWidth: 17 }} />
            </div>
        );
    }

    row = ({ index, style }) => {
        const { rowClassName, rowRenderer } = this.props;

        style = { ...style, width: this.getRowWidth() };

        if (rowRenderer) {
            const rowRendererContent = rowRenderer({ index, style });
            if (rowRendererContent) {
                return rowRendererContent;
            }
        }

        const rowData = this.getDataRow(index);

        const evenClassName = index % 2 === 0 ? 'VTRowOdd' : 'VTRowEven';
        const customClassName = rowClassName && rowClassName(index);

        return (
            <div className={classNames('VTRow', evenClassName, customClassName)} style={style}>
                {React.Children.map(this.props.children, (child, idx) => {
                    const { cellRenderer, dataKey } = child.props;
                    const width = this.getColumnWidth(idx);

                    let content;
                    if (cellRenderer) {
                        content = cellRenderer({ dataKey, rowData, columnIndex: idx });
                    } else {
                        const contentStr = this.getDataRowItem(rowData, dataKey);
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
                            onClick={getAction('onRowClick')}
                            onDoubleClick={getAction('onRowDoubleClick')}
                            onMouseOver={getAction('onRowMouseOver')}
                            onMouseOut={getAction('onRowMouseOut')}
                            onContextMenu={getAction('onRowRightClick')}
                        >
                            {content}
                        </div>
                    );
                })}
            </div>
        );
    };

    renderNoItemsLabel() {
        const { noItemsLabel } = this.props;

        return <div className="VTNoItemsLabel">{noItemsLabel}</div>;
    }

    render() {
        const { height, width, listProps, className } = this.props;

        return (
            <div
                className={classNames('VTContainer', className)}
                ref={i => (this.containerEl = i)}
                style={{ paddingTop: this.getHeaderHeight(), width: width, height: height - this.getHeaderHeight() }}
            >
                {this.renderHeader()}

                {this.getDataSize() ? (
                    <List
                        ref={i => (this.list = i)}
                        innerRef={i => (this.listInnerEl = i)}
                        outerRef={i => (this.listOuterEl = i)}
                        className="VTList"
                        height={height - this.getHeaderHeight()}
                        itemCount={this.getDataSize()}
                        itemSize={this.getRowHeight}
                        width={width}
                        {...listProps}
                    >
                        {this.row}
                    </List>
                ) : (
                    this.renderNoItemsLabel()
                )}
            </div>
        );
    }
}
