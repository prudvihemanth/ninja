import { ResponseToolkit } from "@hapi/hapi";
import fetch from "node-fetch";
import Boom from "@hapi/boom";
import {
    ParsedConfirmedTransaction,
    ParsedInstruction,
    PartiallyDecodedInstruction,
    PublicKey,
  } from "@solana/web3.js";

import Logger from "../utils/logger";

export class ninjaController {

    async getAccoutSlot(pubkey: any) {
        let slot = null;
        try {
            const url = " https://api.devnet.solana.com";
            const accountInfoOptions = {
                method: 'POST',
                body: JSON.stringify({
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "getAccountInfo",
                    "params": [
                        pubkey,
                        {
                            "encoding": "base58"
                        }
                    ]
                }),
                headers: { 'Content-Type': 'application/json' }
            }
            await fetch(url, accountInfoOptions)
                .then(res => res.json())
                .then(json => {
                    slot = json;
                });

            return slot;
        }
        catch (e: any) {
            Logger.error(e.message);
            return Boom.conflict(e.message);
        }
    }

    async getBlocks(slot: any) {
        try {
            const url = " https://api.devnet.solana.com";
            let blocks = null;
            const getBlocksOptions = {
                method: 'POST',
                body: JSON.stringify({ "jsonrpc": "2.0", "id": 1, "method": "getBlocks", "params": [slot] }
                ),
                headers: { 'Content-Type': 'application/json' }
            }
            await fetch(url, getBlocksOptions)
                .then(res => res.json())
                .then(json => {
                    blocks = json;
                });

            return blocks;
        }
        catch (e: any) {
            Logger.error(e.message);
            return Boom.conflict(e.message);
        }
    }

    async getBlockTransactions(slot: any) {
        try {
            const url = " https://api.devnet.solana.com";
            let transactions = null;
            const getTransactionOptions = {
                method: 'POST',
                body: JSON.stringify({ "jsonrpc": "2.0", "id": 1, "method": "getBlocks", "params": [slot] }
                ),
                headers: { 'Content-Type': 'application/json' }
            }
            await fetch(url, getTransactionOptions)
                .then(res => res.json())
                .then(json => {
                    transactions = json;
                });

            return transactions;

        }
        catch (e: any) {

            Logger.error(e.message);
            return Boom.conflict(e.message);

        }
    }


    intoTransactionInstruction () {

    }



    async filterSerumBuyTransactions(transactions: any) {

        const mintMap = new Map<string, MintDetails>();


        transactions.forEach(
            ({ signatureInfo, signature, blockTime, statusClass, statusText }) => {
              const parsed = detailedHistoryMap.get(signature);
              if (!parsed) return;
      
              extractMintDetails(parsed, mintMap);
      
              let instructions: (ParsedInstruction | PartiallyDecodedInstruction)[] = [];
      
              InstructionContainer.create(parsed).instructions.forEach(
                ({ instruction, inner }, index) => {
                  if (isRelevantInstruction(pubkey, address, mintMap, instruction)) {
                    instructions.push(instruction);
                  }
                  instructions.push(
                    ...inner.filter((instruction) =>
                      isRelevantInstruction(pubkey, address, mintMap, instruction)
                    )
                  );
                }
              );
            });
        }
      
            
            

    //     for (const transaction of transactions) {

    //     let transactionInstruction;
    //     if (transaction?.transaction) {
    //       transactionInstruction = this.intoTransactionInstruction(
    //         transaction.transaction,
    //         ix
    //       );
    //     }
    // }

    //     return true;
    // }



    /**
    * Get serum buy transactions.
    *
    * @remarks
    * This method is used to filter serum transactions and logs buy price to opensearch db.
    *
    * @param request - Params Should contain account public key
    * @returns List of buy price and market id's of serum transactions
    *
    */

    async getSerumBuyTransactions(request: any, h: ResponseToolkit) {
        try {
            Logger.info(`user public key is: ${request.params.pubkey}`);
            const slot = await this.getAccoutSlot(request.params.pubkey);
            Logger.info(`slot is: ${slot}`);
            const blocks: any = await this.getBlocks(slot);
            let serumBuyTransactions = [];
            for (const block of blocks) {
                const transactions = await this.getBlockTransactions(block);
                const filteredTransactions = await this.filterSerumBuyTransactions(transactions);
                serumBuyTransactions.push(filteredTransactions);

            };
            return h.response("true").code(201);
        } catch (e: any) {
            Logger.error(
                `error during the filtering of serum transactions ${e.message}`
            );
            return Boom.conflict(e.message);
        }
    }
}
