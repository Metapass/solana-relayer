// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  Message,
  NonceAccount,
  PublicKey,
  SignaturePubkeyPair,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import base58 from "bs58";
import type { NextApiRequest, NextApiResponse } from "next";
import createDurableNonce from "../../utils/nonce";

type Data = {
  result: "success" | "error";
  message:
    | {
        tx: string;
        signatures: ({ key: string; signature: string | null } | null)[];
      }
    | { error: Error };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // const { base64txn } = req.body;
  const mint = Keypair.generate();
  const connection = new Connection(clusterApiUrl("devnet"), "finalized");
  const wallet = Keypair.fromSecretKey(base58.decode(process.env.WALLET!));
  const lamports = await getMinimumBalanceForRentExemptMint(
    connection,
    "recent"
  );
  const nonceAccount = new PublicKey(process.env.NONCEKEY!);
  const nonceAccountAuth = Keypair.fromSecretKey(
    base58.decode(process.env.NONCEAUTH!)
  );
  const nonce = process.env.NONCE as string;
  // const { nonceAccount, nonceAccountAuth } = await createDurableNonce(wallet);
  const txn = new Transaction().add(
    SystemProgram.nonceAdvance({
      noncePubkey: nonceAccount,
      authorizedPubkey: nonceAccountAuth.publicKey,
    }),
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: new PublicKey("DZFbytJWS5BMgaaJQ3LFvqMcm6mqaKqorgT7ZbhDHGY8"),
      lamports: 1,
    })
  );

  console.log("check");

  if (!txn) res.json({ result: "error", message: { error: Error("no txn") } });
  if (!process.env.WALLET)
    res
      .status(200)
      .json({ result: "error", message: { error: Error("no wallet env") } });
  try {
    console.log("try");
    // const { nonceAccount, nonceAccountAuth } = await createDurableNonce(wallet);
    // const txn = new Transaction();
    // const txn = Transaction.from(Buffer.from(base64txn, "base64"));
    // const {nonceAccount,nonceAccountAuth} = await createDurableNonce(wallet)
    // txn.add(poptxn);
    // await new Promise((resolve) => setTimeout(resolve, 15000));
    // let nonceAccountInfo = await connection.getAccountInfo(
    //   nonceAccount.publicKey,
    //   {
    //     commitment: "recent",
    //   }
    // );
    // if (!nonceAccountInfo)
    //   nonceAccountInfo = await connection.getAccountInfo(
    //     nonceAccount.publicKey,
    //     {
    //       commitment: "recent",
    //     }
    //   );
    // if (!nonceAccountInfo) throw new Error("nonce account info null");
    // let nonceAccountNonce = NonceAccount.fromAccountData(
    //   nonceAccountInfo?.data
    // );
    txn.recentBlockhash = nonce;
    txn.feePayer = wallet.publicKey;

    txn.partialSign(wallet, nonceAccountAuth);

    const txnserialized = base58.encode(txn.serializeMessage());
    // const txid = await connection.sendEncodedTransaction(txnserialized, {
    //   preflightCommitment: "finalized",
    // });\
    console.log(txnserialized, "ser");
    const sigs = txn.signatures.map((s) => {
      return {
        key: s.publicKey.toBase58(),
        signature: s.signature ? base58.encode(s.signature) : null,
      };
    });
    console.log(sigs);
    res.json({
      result: "success",
      message: {
        tx: txnserialized,
        signatures: sigs,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ result: "error", message: { error: error as Error } });
  }
}
