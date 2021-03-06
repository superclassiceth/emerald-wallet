import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import NewAccountProps from '../../src/components/accounts/GenerateAccount/AccountPropsDialog';

storiesOf('NewAccountProps', module)
  .add('default', () => (<NewAccountProps onSave={action('onSave')} onSkip={action('onSkip')}/>));
