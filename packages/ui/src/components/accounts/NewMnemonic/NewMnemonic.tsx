import { Input, Page, Warning, WarningHeader, WarningText } from '@emeraldplatform/ui';
import { Back } from '@emeraldplatform/ui-icons';
import { withStyles } from '@material-ui/styles';
import * as React from 'react';
import Button from '../../common/Button';

export const styles = {
  formRow: {
    display: 'flex',
    marginBottom: '19px',
    alignItems: 'center'
  },
  left: {
    flexBasis: '20%',
    marginLeft: '14.75px',
    marginRight: '14.75px'
  },
  right: {
    flexGrow: 2,
    display: 'flex',
    alignItems: 'center',
    marginLeft: '14.75px',
    marginRight: '14.75px',
    maxWidth: '580px'
  }
};

interface Props {
  onBack?: any;
  mnemonic?: string;
  onGenerate?: any;
  onContinue?: any;
  classes: any;
}

export class NewMnemonic extends React.Component<Props> {

  public render () {
    const {
      onBack, mnemonic, onGenerate, onContinue, classes
    } = this.props;
    return (
      <Page title='New Mnemonic account' leftIcon={<Back onClick={onBack}/>}>
        <div className={classes.formRow}>
          <div className={classes.left}/>
          <div className={classes.right}>
            <Warning fullWidth={true}>
              <WarningHeader>Keep this phrase in a safe place.</WarningHeader>
              <WarningText>If you lose this phrase you will not be able to recover your account.</WarningText>
            </Warning>
          </div>
        </div>
        <div className={classes.formRow}>
          <div className={classes.left}/>
          <div className={classes.right}>
            <div style={{ width: '100%' }}>
              <div>Mnemonic phrase</div>
              <div>
                <Input
                  disabled={true}
                  value={mnemonic}
                  multiline={true}
                  rowsMax={4}
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={classes.formRow}>
          <div className={classes.left}/>
          <div className={classes.right}>
            {mnemonic && <Button primary={true} label='Continue' onClick={onContinue} />}
            {!mnemonic && <Button primary={true} label='Generate' onClick={onGenerate} />}
          </div>
        </div>
      </Page>
    );
  }
}

export default withStyles(styles)(NewMnemonic);
