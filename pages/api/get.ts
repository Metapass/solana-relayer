// make a get api

import { Connection, NonceAccount, PublicKey } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getNonceAccount(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const { address } = req.body;

    const con = new Connection(process.env.ALCHEMY!, { commitment: "recent" });
    const data = await con.getAccountInfo(new PublicKey(address), {
      commitment: "recent",
    });
    const nonce = NonceAccount.fromAccountData(data!.data);
    console.log(nonce.nonce);
    res.json({
      result: "success",
      message: {
        nonceAccount: nonce.nonce,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ result: "error", message: { error: error as Error } });
  }
}
