import React from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

export default class ColumnResizer extends React.Component {
    static propTypes = {
        onResizeColumn: PropTypes.func.isRequired,
    };

    handleDrag = (event, data) => {
        const { onResizeColumn } = this.props;
        onResizeColumn(data.x);
    };

    handleClick = event => {
        event.stopPropagation();
    };

    render() {
        return (
            <Draggable
                axis="x"
                defaultClassName={'VTColumnResizer'}
                defaultClassNameDragging={'VTColumnResizerActive'}
                onStop={this.handleDrag}
                position={{
                    x: 0,
                    y: 0,
                }}
                zIndex={999}
            >
                <div className="VTColumnResizer" onClick={this.handleClick} />
            </Draggable>
        );
    }
}
