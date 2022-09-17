import { Button, Col, Container, Loading, Row, Text } from "@nextui-org/react";
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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ConnectWallet } from "../components/ct";
import ModalComponent from "../components/modal";
import styles from "../styles/Home.module.css";
import createDurableNonce from "../utils/nonce";

const Home: NextPage = () => {
  const [address, setAddress] = useState("");
  const [explorerLink, setExplorerLink] = useState("");
  const wallet = useWallet();
  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);
  const [loading, setLoading] = useState(false);
  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };
  const call = async () => {
    if (!wallet || !wallet.publicKey) return;
    setLoading(true);
    const connection = new Connection(process.env.NEXT_PUBLIC_ALCHEMY!);

    try {
      if (wallet.signTransaction) {
        const { data: txnData } = await axios.post("/api/tx", {
          address: wallet.publicKey.toString(),
        });
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
        console.log(sigs, "sigs", signatures);
        signatures.map((s: { key: string; signature: string }) => {
          console.log(s, "s");
          s.signature &&
            tx.addSignature(
              new PublicKey(s.key),
              Buffer.from(base58.decode(s.signature))
            );
        });

        // const txn = await wallet.signTransaction(tx);
        try {
          const txid = await connection.sendRawTransaction(tx.serialize(), {
            preflightCommitment: "recent",
          });
          console.log(`https://explorer.solana.com/tx/${txid}`);
          setExplorerLink(`https://explorer.solana.com/tx/${txid}`);
          toast.success(`Success!`, {
            id: "done",
          });
          setVisible(true);
          setLoading(false);
        } catch (e) {
          let error = e as Error;
          console.log(error, "error");
          toast.error(error.message, {
            id: "err",
          });
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   setVisible(true);
  //   setExplorerLink("https://explorer.solana.com/tx/dibibissb");
  // }, []);
  return (
    <Col>
      <ModalComponent
        visible={visible}
        closeHandler={closeHandler}
        setVisible={setVisible}
        explorerLink={explorerLink}
      />
      <Row
        justify="center"
        style={{
          marginTop: "2rem",
        }}
      >
        {/* <Container
          justify="center"
          style={{
            // border: "1px solid red",
            padding: "0px",
          }}
        > */}
        <Text>
          <Text
            h1
            style={{
              fontSize: "8rem",
              marginBottom: "-2rem",
              // display: "table-caption",
              textAlign: "center",
            }}
          >
            {"Dont."}
          </Text>

          <Text
            h1
            style={{
              // marginLeft: "1.5rem",
              marginBottom: "-2rem",
              fontSize: "8rem",
              // display: "table-caption",
              textAlign: "center",
            }}
          >
            {"Pay."}
          </Text>
          <Text
            color="#31d1bf"
            h1
            style={{
              // marginLeft: "1.5rem",
              fontSize: "8rem",
              // display: "table-caption",
              textAlign: "center",
            }}
          >
            {" Rent."}
          </Text>
        </Text>
        {/* </Container> */}
      </Row>
      <Row justify="center">
        {" "}
        <Button
          style={{
            margin: "1rem",
            backgroundColor: "white",
            color: "black",
            textAlign: "center",
          }}
          icon={
            <Image
              // style={{
              //   marginRight: "0.1rem",
              // }}
              src="/phantom.svg"
              alt="phantom"
              width="25%"
              height="25%"
            />
          }
        >
          <ConnectWallet setAddress={setAddress} noToast={false}>
            {(address.length > 0 &&
              address.substring(0, 5) +
                "..." +
                address.substring(35, address.length - 5)) ||
              "Connect Wallet"}
          </ConnectWallet>
        </Button>
        <Button
          style={{
            margin: "1rem",
            fontSize: "1rem",
          }}
          onClick={call}
        >
          {loading && <Loading color="currentColor" type="spinner" size="sm" />}
          Testdrive 🪄
        </Button>
      </Row>
      <Text
        style={{
          color: "GrayText",
          margin: "2rem",
          textAlign: "center",
          lineHeight: "1.6rem",
          fontWeight: "400",
          letterSpacing: "-0.02em",
          fontSize: "1.25rem",
        }}
      >
        Solana Relayer allows you to onboard more users to your dapp by paying
        gas on their behalf.
        <br /> Most users don&apos;t like the idea of paying gas fees, you can
        forward that fee to yourself and still allow your users to use your
        dapp.
      </Text>
    </Col>
  );
};

export default Home;
