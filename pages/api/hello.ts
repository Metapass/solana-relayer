// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  clusterApiUrl,
  Connection,
  Keypair,
  Message,
  Transaction,
} from "@solana/web3.js";
import base58 from "bs58";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  result: "success" | "error";
  message: { tx: string } | { error: Error };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { base64txn } = req.body;
  if (!base64txn)
    res.json({ result: "error", message: { error: Error("no txn") } });
  if (!process.env.WALLET)
    res.json({ result: "error", message: { error: Error("no wallet env") } });
  try {
    const connection = new Connection(clusterApiUrl("devnet"), "finalized");
    const wallet = Keypair.fromSecretKey(base58.decode(process.env.WALLET!));
    const txn = Transaction.populate(
      Message.from(Buffer.from(base64txn, "base64"))
    );
    txn.partialSign(wallet);

    const txnserialized = txn
      .serialize({
        verifySignatures: true,
        requireAllSignatures: true,
      })
      .toString();
    const txid = await connection.sendEncodedTransaction(txnserialized, {
      preflightCommitment: "finalized",
    });
    res.json({ result: "success", message: { tx: txid } });
  } catch (error) {
    res
      .status(500)
      .json({ result: "error", message: { error: error as Error } });
  }
}
