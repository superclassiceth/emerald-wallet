import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Landing from '../../src/components/Landing';

storiesOf('Landing', module)
  .add('default', () => (<Landing />));
