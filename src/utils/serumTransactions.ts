import {
    PublicKey,
    SystemProgram,
    StakeProgram,
    VOTE_PROGRAM_ID,
    BPF_LOADER_PROGRAM_ID,
    BPF_LOADER_DEPRECATED_PROGRAM_ID,
    SYSVAR_CLOCK_PUBKEY,
    SYSVAR_RENT_PUBKEY,
    SYSVAR_REWARDS_PUBKEY,
    SYSVAR_STAKE_HISTORY_PUBKEY,
    ParsedTransaction,
    TransactionInstruction,
    Transaction,
    PartiallyDecodedInstruction,
    ParsedInstruction,
    Secp256k1Program,
} from "@solana/web3.js";


import bs58 from "bs58";

import { decodeInstruction, MARKETS } from "@project-serum/serum";

const SERUM_PROGRAM_IDS = [
    "4ckmDgGdxQoPDLUkDT3vHgSAkzA3QRdNq5ywwY4sUSJn",
    "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
];

type InstructionType = {
    name: string;
    innerInstructions: (ParsedInstruction | PartiallyDecodedInstruction)[];
};

//   export const Side = enums(["buy", "sell"]);

export function intoTransactionInstruction(
    tx: ParsedTransaction,
    instruction: ParsedInstruction | PartiallyDecodedInstruction
): TransactionInstruction | undefined {
    const message = tx.message;
    if ("parsed" in instruction) return;

    const keys = [];
    for (const account of instruction.accounts) {
        const accountKey = message.accountKeys.find(({ pubkey }) =>
            pubkey.equals(account)
        );
        if (!accountKey) return;
        keys.push({
            pubkey: accountKey.pubkey,
            isSigner: accountKey.signer,
            isWritable: accountKey.writable,
        });
    }

    return new TransactionInstruction({
        data: bs58.decode(instruction.data),
        keys: keys,
        programId: instruction.programId,
    });
}



export function getTransactionInstruction(transaction: any) {
   const instructions = transaction.message.instructions;

   type InstructionType = {
    name: string;
    innerInstructions: (ParsedInstruction | PartiallyDecodedInstruction)[];
  };
  

   instructions
        .map((ix : any, index: any): InstructionType | undefined => {
            
        })

   
    if (transaction?.transaction) {
        transactionInstruction = intoTransactionInstruction(
            transaction.transaction,
            ix
        );
    }
    return transactionInstruction;
}

export function isSerumInstruction(instruction: TransactionInstruction) {
    return (
        SERUM_PROGRAM_IDS.includes(instruction.programId.toBase58()) ||
        MARKETS.some(
            (market) =>
                market.programId && market.programId.equals(instruction.programId)
        )
    );
}
