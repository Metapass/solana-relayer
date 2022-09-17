import {
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  Message,
  NonceAccount,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import axios from "axios";
import base58 from "bs58";
import bs58 from "bs58";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { ConnectWallet } from "../components/ct";
import styles from "../styles/Home.module.css";
import createDurableNonce from "../utils/nonce";

const Home: NextPage = () => {
  const [address, setAddress] = useState("");
  const wallet = useWallet();
  const call = async () => {
    if (!wallet || !wallet.publicKey) return;
    // const wallet = Keypair.generate();
    const connection = new Connection(process.env.NEXT_PUBLIC_ALCHEMY!);
    // console.log(wallet.publicKey!.toString(), "wallet");
    // const { data: nonceAccs } = await axios.post("/api/nonce");
    // let { nonceAccount, nonceAccountAuth } = nonceAccs.message as {
    //   nonceAccount: string | PublicKey;
    //   nonceAccountAuth: string | Keypair;
    // };
    // nonceAccount = new PublicKey(nonceAccount);
    // nonceAccountAuth = JSON.parse(nonceAccountAuth as string);
    // console.log(nonceAccount, nonceAccountAuth, "nonce");

    // ix.signatures.map((s) =>
    //   console.log(
    //     `wallet: ${s.publicKey.toString()} | signature: ${
    //       s.signature ? bs58.encode(s.signature) : s.signature
    //     }`
    //   )
    // );
    // console.log(
    //   `nonceaccount: ${nonceAccount.toString()}`,
    //   ix.signatures.length
    // );
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // let nonceAccountInfo = await connection.getAccountInfo(nonceAccount, {
    //   commitment: "recent",
    // });
    // if (!nonceAccountInfo)
    //   nonceAccountInfo = await connection.getAccountInfo(nonceAccount, {
    //     commitment: "recent",
    //   });
    // if (!nonceAccountInfo) throw new Error("nonce account info null");
    // let nonceAccountNonce = NonceAccount.fromAccountData(
    //   nonceAccountInfo?.data
    // );

    // ix.recentBlockhash = nonceAccountNonce.nonce;
    // console.log(ix.recentBlockhash, "recentBlockhash");
    // ix.feePayer = new PublicKey("9mHGvCrhZnd6X4Vj9xnavTH9vvr56zvGHXR2KhifTCU8");
    // const tx = await

    if (wallet.signTransaction) {
      const { data: txnData } = await axios.post("/api/hello");
      const { signatures } = txnData.message;
      console.log(txnData, "signatures");
      const tx = Transaction.populate(
        Message.from(base58.decode(txnData.message.tx))
      );
      const sigs = tx.signatures.map((s) => {
        return {
          key: s.publicKey.toBase58(),
          signature: s.signature ? base58.encode(s.signature) : null,
        };
      });
      console.log(sigs, "sigs");
      signatures.map((s: { key: string; signature: string }) => {
        console.log(s, "s");
        tx.addSignature(
          new PublicKey(s.key),
          Buffer.from(base58.decode(s.signature))
        );
      });

      const txn = await wallet.signTransaction(tx);
      const txid = await connection.sendRawTransaction(txn.serialize(), {
        preflightCommitment: "recent",
      });

      console.log(txid, "txn");
    }
  };
  return (
    <div>
      <ConnectWallet setAddress={setAddress} noToast={false}>
        {" "}
        <button>{(address.length > 0 && address) || "Connect Wallet"}</button>
      </ConnectWallet>
      <button onClick={call}>Test</button>
    </div>
  );
};

export default Home;
