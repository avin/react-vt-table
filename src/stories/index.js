import { storiesOf } from '@storybook/react';
import '../lib/style.css';
import './style.css';
import simple from './simple';
import sort from './sort';
import selection from './selection';
import rowRenderer from './rowRenderer';
import scrollTo from './scrollTo';
import changeColumns from './changeColumns';

storiesOf('Table', module)
    .add('Simple table', simple)
    .add('Table with sorting', sort)
    .add('Table with selection', selection)
    .add('Scroll to item', scrollTo)
    .add('Custom row renderer', rowRenderer)
    .add('Change columns', changeColumns);
