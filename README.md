# React-VT-Table

Table realisation based on `react-window` library.

## Features

-   Efficiently rendering large tables.
-   Resize columns.
-   Easy to add your own sorting and selecting mechanisms.
-   Works with Immutable.Iterable data lists or native arrays of objects.

## Installation

```sh
npm install react-vt-table
```

## Demo

Here are [some live examples](https://avin.github.io/react-vt-table?selectedKind=Table).

## Examples

Check out `./src/stories` folder to find some code examples.

## Styling

You can use built-in CSS style:

```js
import 'react-vt-table/dist/style.css';
```

or create your own using existing one

## API

### `<Table />`

#### Props

| Property                | Type               | Required? | Description                                                                                                                                |
| :---------------------- | :----------------- | :-------: | :----------------------------------------------------------------------------------------------------------------------------------------- |
| width                   | Number             |     ✓     | Table width.                                                                                                                               |
| height                  | Number             |     ✓     | Table height.                                                                                                                              |
| headerHeight            | Number or Func     |           | Table header height (Default: 30).                                                                                                         |
| rowHeight               | Number or Func     |           | Table row height (Default: 30). <br>Function params: `(rowIndex)`.                                                                         |
| data                    | Immutable.Iterable |     ✓     | Data list for table content.                                                                                                               |
| rowClassName            | Func               |           | Row className determine function. <br>Function params: `(rowIndex)`.                                                                       |
| rowRenderer             | Func               |           | Personal row renderer function (If nothing return, then internal row function will be applied). <br>Function params: `({ index, style })`. |
| sortIndicatorRenderer   | Func               |     ✓     | Sort indicator render function. <br>Function params: `({ dataKey, columnIndex })`.                                                         |
| onHeaderClick           | Func               |           | Click Mouse action on header row. <br>Function params: `(event, { dataKey, columnIndex })`.                                                |
| onHeaderDoubleClick     | Func               |           | Double Click Mouse action on header row. <br>Function params: `(event, { dataKey, columnIndex })`.                                         |
| onHeaderHeaderMouseOver | Func               |           | Mouse Over action on header row. <br>Function params: `(event, { dataKey, columnIndex })`.                                                 |
| onHeaderMouseOut        | Func               |           | Mouse Out action on header row. <br>Function params: `(event, { dataKey, columnIndex })`.                                                  |
| onHeaderRightClick      | Func               |           | Right Click Mouse action on header row. <br>Function params: `(event, { dataKey, columnIndex })`.                                          |
| onRowClick              | Func               |           | Click Mouse action on table row. <br>Function params: `(event, { dataKey, columnIndex })`.                                                 |
| onRowDoubleClick        | Func               |           | Double Click Mouse action on table row. <br>Function params: `(event, { dataKey, columnIndex })`.                                          |
| onRowMouseOver          | Func               |           | Mouse Over action on table row. <br>Function params: `(event, { dataKey, columnIndex })`.                                                  |
| onRowMouseOut           | Func               |           | Mouse Out action on table row. <br>Function params: `(event, { dataKey, columnIndex })`.                                                   |
| onRowRightClick         | Func               |           | Right Click Mouse action on table row. <br>Function params: `(event, { dataKey, columnIndex })`.                                           |
| onScroll                | Func               |           | Action on table scroll. <br>Function params: See [React-Window's docs](https://react-window.now.sh/#/api/FixedSizeList).                   |
| onResizeColumn          | Func               |           | Action on change column width. <br>Function params: `({ dataKey, columnIndex, resizeDiff, newWidth })`.                                    |
| overflowWidth           | Number             |           | Width of vertical table overflow.                                                                                                          |
| minColumnWidth          | Number             |           | Minimal column width.                                                                                                                      |
| maxColumnWidth          | Number             |           | Maximum column width.                                                                                                                      |
| dynamicColumnWidth      | Bool               |           | Dynamic width for columns that was not resized.                                                                                            |
| listProps               | Object             |           | Props for inner `react-window` list component. @see See [React-Windows docs](https://react-window.now.sh/#/api/FixedSizeList)              |
| noItemsLabel            | Node               |           | No items in data list label.                                                                                                               |
| disableHeader           | Bool               |           | Hide table header row.                                                                                                                     |
| className               | String             |           | Optional custom CSS class name to attach to root container element.                                                                        |
| id                      | String             |           | Optional custom id to attach to root container element.                                                                                    |

#### Methods

**scrollTo(scrollOffset: number): void**

**scrollToItem(index: number, align: string = "auto"): void**

For more info see [React-Window's docs](https://react-window.now.sh/#/api/FixedSizeGrid)

### `<Column />` Props

| Property                 | Type   | Required? | Description                                                                                   |
| :----------------------- | :----- | :-------: | :-------------------------------------------------------------------------------------------- |
| cellRenderer             | Func   |           | Content cell render function. <br>Function params: `({ dataKey, rowData, columnIndex })`.     |
| columnHeaderCellRenderer | Func   |           | Column header cell render function. <br>Function params: `({ label, dataKey, columnIndex })`. |
| dataKey                  | String |           | Field key containing data.                                                                    |
| width                    | Number |           | Default column width in pixels.                                                               |

## License

MIT © [avin](https://github.com/avin)
