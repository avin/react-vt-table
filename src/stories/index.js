import { storiesOf } from '@storybook/react';
import '../lib/style.css';
import './style.css';
import simple from './simple';
import sort from './sort';
import selection from './selection';

storiesOf('Table', module)
    .add('Simple table', simple)
    .add('Table with sorting', sort)
    .add('Table with selection', selection);
