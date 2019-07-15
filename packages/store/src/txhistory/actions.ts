import { Blockchains, BlockchainCode, IApi, blockchainByName } from '@emeraldwallet/core';
import * as blockchains from '../blockchains';
import { ipcRenderer } from 'electron';
import {ActionTypes, HistoryAction, UpdateTxsAction} from './types';
import {Dispatched, Transaction} from "../types";
import {Dispatch} from "react";
import { loadTransactions, storeTransactions } from './historyStorage';
import { allTrackedTxs } from './selectors';

const txStoreKey = (chainId: number) => `chain-${chainId}-trackedTransactions`;

function persistTransactions(state: any, chainId: number) {
  const txs = allTrackedTxs(state).toJS().filter((t: Transaction) => (t.chainId === chainId));
  storeTransactions(
    txStoreKey(chainId),
    txs
  );
}

function loadPersistedTransactions(state: any, chainId: number) {
  const loaded = loadTransactions(txStoreKey(chainId), chainId);

  const txs = loaded.map((tx) => ({
    ...tx,
    chainId,
  }));
  return txs;
}

function updateAndTrack(dispatch: Dispatch<any>, getState: Function, api: IApi, txs: Transaction[], chain: BlockchainCode) {
  const chainId = Blockchains[chain].params.chainId;
  const pendingTxs = txs.filter((tx) => !tx.blockNumber).map((t) => ({...t, chainId, chain}));
  if (pendingTxs.length !== 0) {
    dispatch({type: ActionTypes.TRACK_TXS, txs: pendingTxs});
  }

  persistTransactions(getState(), chainId);

  txs.forEach((tx) => {
    ipcRenderer.send('subscribe-tx', chain, tx.hash);
  });
}


export function trackTx(tx: Transaction, chain: BlockchainCode) {
  return (dispatch: Dispatch<any>, getState: Function, api: IApi) => updateAndTrack(dispatch, getState, api, [tx], chain);
}
export function trackTxs(txs: Transaction[], chain: BlockchainCode) {
  return (dispatch: Dispatch<any>, getState: Function, api: IApi) => updateAndTrack(dispatch, getState, api, txs, chain);
}

export function init(chains: BlockchainCode[]): Dispatched<HistoryAction> {
  return (dispatch, getState) => {
    console.debug('Loading persisted transactions...');

    const storedTxs = [];

    for (const chain of chains) {
      // load history for chain
      const chainId = blockchainByName(chain).params.chainId;
      storedTxs.push(...loadPersistedTransactions(getState(), chainId));
    }

    dispatch({
      type: ActionTypes.LOAD_STORED_TXS,
      transactions: storedTxs,
    });
  };
}

const txUnconfirmed = (state: any, tx: any) => {
  const chainCode = tx.get('chain').toLowerCase();
  const currentBlock = blockchains.selectors.getHeight(state, chainCode);
  const txBlockNumber = tx.get('blockNumber');

  if (!txBlockNumber) {
    return true;
  }

  const numConfirmsForTx = txBlockNumber - currentBlock;

  const requiredConfirms = state.wallet.settings.get('numConfirmations');
  return requiredConfirms < numConfirmsForTx;
};

/**
 * Refresh only tx with totalRetries <= 10
 */
export function refreshTrackedTransactions(): Dispatched<HistoryAction> {
  return (dispatch, getState) => {
    const state = getState();
    allTrackedTxs(state)
      .filter((tx: any) => tx.get('totalRetries', 0) <= 10)
      .filter((tx: any) => txUnconfirmed(state, tx))
      .forEach((tx: any) => ipcRenderer.send('subscribe-tx', tx.get('chain'), tx.get('hash')));
  };
}

export function updateTxs(transactions: any): UpdateTxsAction {
  return {
    type: ActionTypes.UPDATE_TXS,
    payload: transactions
  }
}