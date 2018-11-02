import React from 'react';
import ColumnResizer from '../ColumnResizer';
import PropTypes from 'prop-types';

export default class Header extends React.Component {
    static propTypes = {
        children: PropTypes.array,
        getHeaderHeight: PropTypes.func.isRequired,
        getColumnWidth: PropTypes.func.isRequired,
        height: PropTypes.number.isRequired,
        onClick: PropTypes.func,
        onDoubleClick: PropTypes.func,
        onMouseOver: PropTypes.func,
        onMouseOut: PropTypes.func,
        onRightClick: PropTypes.func,
        onResizeColumn: PropTypes.func,
        sortIndicatorRenderer: PropTypes.func,
    };

    static defaultProps = {
        onResizeColumn: f => f,
        sortIndicatorRenderer: () => null,
    };

    render() {
        const {
            children,
            getHeaderHeight,
            getColumnWidth,
            onResizeColumn,
            sortIndicatorRenderer,
            overflowWidth,
        } = this.props;
        let idx = 0;
        return (
            <div className="VTHeader" style={{ height: getHeaderHeight() }} ref={i => (this.headerEl = i)}>
                {React.Children.map(children, child => {
                    let columnIndex = idx;
                    if (!child) {
                        return null;
                    }
                    let { label, dataKey, columnHeaderCellRenderer } = child.props;
                    const width = getColumnWidth(columnIndex);

                    let content;
                    if (columnHeaderCellRenderer) {
                        content = columnHeaderCellRenderer({ label, dataKey, columnIndex });
                    } else {
                        content = (
                            <div className="VTCellContent" title={label}>
                                {label}
                            </div>
                        );
                    }

                    const getAction = actionName => {
                        const action = this.props[actionName];
                        if (action) {
                            return event => action(event, { dataKey, columnIndex });
                        }
                    };

                    idx += 1;

                    return (
                        <div
                            className="VTHeaderCell"
                            style={{ minWidth: width, maxWidth: width }}
                            onClick={getAction('onClick')}
                            onDoubleClick={getAction('onDoubleClick')}
                            onMouseOver={getAction('onMouseOver')}
                            onMouseOut={getAction('onMouseOut')}
                            onContextMenu={getAction('onRightClick')}
                        >
                            {content}

                            <ColumnResizer onResizeColumn={diff => onResizeColumn(columnIndex, diff, dataKey)} />

                            {sortIndicatorRenderer({ dataKey: child.props.dataKey, columnIndex })}
                        </div>
                    );
                })}
                <div className="VTHeaderCell" style={{ minWidth: overflowWidth, maxWidth: overflowWidth }} />
            </div>
        );
    }
}
