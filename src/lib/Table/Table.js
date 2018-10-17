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
         * Ширина таблицы
         */
        width: PropTypes.number.isRequired,
        /**
         * Высота таблицы
         */
        height: PropTypes.number.isRequired,
        /**
         * Высота строки заголовка
         */
        headerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
        /**
         * Высота строки таблицы
         *
         * @param {Number} index Порядковый номер элемента в списке данных
         */
        rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
        /**
         * Список данных
         */
        data: PropTypes.instanceOf(Immutable.Iterable).isRequired,
        /**
         * Функция определяющая класс строки
         */
        rowClassName: PropTypes.func,
        /**
         * Рендер функция для отрисовки индикатора сортировки
         *
         * @param {object} props
         */
        sortIndicatorRenderer: PropTypes.func,
        /**
         * Действие при клике на хедер колонки
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
         * Действие при клике на строку таблицы
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
         * Действие при скроле таблицы
         *
         * @param {object} params
         *      @see Смотреть [React-Windows docs](https://react-window.now.sh/#/api/FixedSizeList)
         */
        onScroll: PropTypes.func,
        /**
         * Действие при изменении ширины колонки
         *
         * @param {object} params
         */
        onResizeColumn: PropTypes.func,
        /**
         * Ширина бокового скрола
         */
        overflowWidth: PropTypes.number,
        /**
         * Минимальная ширина колонки
         */
        minColumnWidth: PropTypes.number,
        /**
         * Максимальная ширина колонки
         */
        maxColumnWidth: PropTypes.number,
        /**
         * Динамическая ширина колонок не подвергшихся ручному изменению размера
         */
        dynamicColumnWidth: PropTypes.bool,
        /**
         * Свойства для вложенного компонента списка react-window
         * @see Смотреть [React-Windows docs](https://react-window.now.sh/#/api/FixedSizeList)
         */
        listProps: PropTypes.object,
        /**
         * Надпись информирующая об отсутствии элементов в таблице
         */
        noItemsLabel: PropTypes.node,
        /**
         * Отключить хедер таблицы
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
        headerHeight: 35,
        rowHeight: 35,
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
        //Заполняем массив с ширинами колонок значениями из компонент колонок
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
            //Заполняем оставшиеся значения усредненной шириной по оставшемуся пространству
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
        const { data, rowClassName } = this.props;
        const rowData = data.get(index);

        const evenClassName = index % 2 === 0 ? 'VTRowOdd' : 'VTRowEven';
        const customClassName = rowClassName && rowClassName(index);

        return (
            <div className={classNames('VTRow', evenClassName, customClassName)} style={{ ...style, width: undefined }}>
                {React.Children.map(this.props.children, (child, idx) => {
                    const { cellRenderer, dataKey } = child.props;
                    const width = this.getColumnWidth(idx);

                    let content;
                    if (cellRenderer) {
                        content = cellRenderer({ dataKey, rowData, columnIndex: idx });
                    } else {
                        content = (
                            <div className="VTCellContent" title={rowData.get(dataKey)} style={{ lineHeight: style.height + 'px' }}>
                                {rowData.get(dataKey)}
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
        const { height, width, data, listProps, className } = this.props;

        return (
            <div
                className={classNames('VTContainer', className)}
                ref={i => (this.containerEl = i)}
                style={{ paddingTop: this.getHeaderHeight(), width: width, height: height }}
            >
                {this.renderHeader()}

                {data.size ? (
                    <List
                        ref={i => (this.list = i)}
                        innerRef={i => (this.listInnerEl = i)}
                        outerRef={i => (this.listOuterEl = i)}
                        className="VTList"
                        height={height}
                        itemCount={data.size}
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
