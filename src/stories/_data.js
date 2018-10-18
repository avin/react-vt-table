import * as Immutable from 'immutable';

const randomStr = (len = 5) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < len; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

function randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let dataList = new Immutable.List();
for (let i = 0; i < 1000; i += 1) {
    dataList = dataList.push(
        new Immutable.Map({
            c1: `${Math.floor(i / 10)}_word_c1`,
            c2: `${Math.floor(i / 10)}_word_c2`,
            c3: `${Math.floor(i / 10)}_${randomStr()}_word_c3`,
            c4: `${Math.floor(i / 10)}_${randomStr()}_word_c4`,
            color: randomColor(),
        }),
    );
}

export default dataList;
