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
        const { children, height, getHeaderHeight, getColumnWidth, onResizeColumn, sortIndicatorRenderer } = this.props;
        return (
            <div className="VTHeader" style={{ height: getHeaderHeight() }} ref={i => (this.headerEl = i)}>
                {React.Children.map(children, (child, idx) => {
                    if (!child) {
                        return null;
                    }
                    let { label, dataKey, columnHeaderCellRenderer } = child.props;
                    const width = getColumnWidth(idx);

                    let content;
                    if (columnHeaderCellRenderer) {
                        content = columnHeaderCellRenderer({ label, dataKey, columnIndex: idx });
                    } else {
                        content = (
                            <div className="VTCellContent" title={label} style={{ lineHeight: height + 'px' }}>
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
                            onClick={getAction('onClick')}
                            onDoubleClick={getAction('onDoubleClick')}
                            onMouseOver={getAction('onMouseOver')}
                            onMouseOut={getAction('onMouseOut')}
                            onContextMenu={getAction('onRightClick')}
                        >
                            {content}

                            <ColumnResizer onResizeColumn={diff => onResizeColumn(idx, diff, dataKey)} />

                            {sortIndicatorRenderer({ dataKey: child.props.dataKey, columnIndex: idx })}
                        </div>
                    );
                })}
                <div className="VTHeaderCell" style={{ minWidth: 17, maxWidth: 17 }} />
            </div>
        );
    }
}
