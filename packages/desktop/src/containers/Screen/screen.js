import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Wei } from '@emeraldplatform/eth';
import {
  ContactList as AddressBook, AddContact, PaperWallet, ExportPaperWallet, TxDetails,
  ImportMnemonic, CreateTransaction, BroadcastTx, ImportPrivateKey, ImportLedgerAccount, GenerateAccount,
  Settings, MnemonicWizard, WalletDetails, Home, Welcome, CreateAccountWizard
} from '@emeraldwallet/react-app';
import createLogger from '../../utils/logger';
import { screen } from '@emeraldwallet/store';
import { TERMS_VERSION } from '../../store/config';
const log = createLogger('screen');

const Screen = (props) => {
  log.debug('Show screen: ', props.screen);

  if (props.screen === null) {
    return (<div>
      <CircularProgress size={50} secondary="true" /> Initializing...
    </div>);
  }
  if (props.screen === screen.Pages.HOME) {
    return (<Home />);
  }
  if (props.screen === 'address-book') {
    return <AddressBook />;
  }
  if (props.screen === 'add-address') {
    return <AddContact />;
  }
  if (props.screen === 'landing-add-from-ledger') {
    return <ImportLedgerAccount onBackScreen={props.screenItem} />;
  } if (props.screen === 'add-from-ledger') {
    return <ImportLedgerAccount />;
  } if (props.screen === 'wallet') {
    return <WalletDetails wallet={ props.screenItem }/>;
  } if (props.screen === 'transaction') {
    return <TxDetails hash={ props.screenItem.hash } accountId={ props.screenItem.accountId }/>;
  } if (props.screen === 'create-tx') {
    return (<CreateTransaction account={ props.screenItem } />);
  } if (props.screen === 'broadcast-tx') {
    return <BroadcastTx tx={props.screenItem.tx} signed={props.screenItem.signed} />;
  }
  if (props.screen === 'repeat-tx') {
    const {transaction, toAccount, fromAccount} = props.screenItem;
    const amount = new Wei(transaction.value);
    const to = (toAccount && toAccount.id) || transaction.to;
    const gasLimit = transaction.gas;
    const { data, typedData, mode } = transaction;
    return (
      <CreateTransaction
        account={ fromAccount }
        to={to}
        amount={amount}
        gasLimit={gasLimit}
        data={data}
        typedData={typedData}
        mode={mode}
      />);
  }
  if (props.screen === 'landing-generate') {
    return <GenerateAccount backLabel="Back"/>;
  }
  if (props.screen === 'generate') {
    return <GenerateAccount />;
  }
  if (props.screen === 'importjson') {
    return <ImportJson />;
  }
  if (props.screen === 'landing-importjson') {
    return <ImportJson backLabel="Back"/>;
  }
  if (props.screen === 'import-private-key') {
    return <ImportPrivateKey />;
  }
  if (props.screen === 'landing-import-private-key') {
    return <ImportPrivateKey />;
  }
  if (props.screen === 'import-mnemonic') {
    return <ImportMnemonic />;
  }
  if (props.screen === 'new-mnemonic') {
    return <MnemonicWizard />;
  }
  if (props.screen === 'welcome') {
    return <Welcome currentTermsVersion={TERMS_VERSION} />;
  }
  if (props.screen === 'settings') {
    return <Settings />;
  }
  if (props.screen === 'paper-wallet') {
    return <PaperWallet address={ props.screenItem.address } privKey={ props.screenItem.privKey } />;
  }
  if (props.screen === 'export-paper-wallet') {
    return <ExportPaperWallet accountId={ props.screenItem.address } blockchain={ props.screenItem.blockchain } />;
  }
  if (props.screen === 'add-account') {
    return <CreateAccountWizard />;
  }

  return (
    <div>
            Unknown screen
    </div>
  );
};

export default connect(
  (state, ownProps) => screen.selectors.getCurrentScreen(state),
  (dispatch, ownProps) => ({})
)(Screen);
