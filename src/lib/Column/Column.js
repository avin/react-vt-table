import React from 'react';
import PropTypes from 'prop-types';

export default class Column extends React.Component {
    static propTypes = {
        /**
         * Рендер ячейки строки содержимого
         */
        cellRenderer: PropTypes.func,
        /**
         * Рендер ячейки строки заколовка
         */
        columnHeaderCellRenderer: PropTypes.func,
        /**
         * Имя поля содержащее данные
         */
        dataKey: PropTypes.string,
        /**
         * Ширина колонки по умолчанию
         */
        width: PropTypes.number,
    };

    render() {
        return <span />;
    }
}
