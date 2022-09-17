import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const ConnectWallet = ({
  children,
  redirectToWelcome,
  noToast,

  setAddress,
}: {
  children: React.ReactNode;
  noFullSize?: boolean;
  redirectToWelcome?: boolean;
  noToast?: boolean;

  setAddress: any;
}) => {
  const { wallet: SolanaWallet, connect, publicKey } = useWallet();
  const { visible, setVisible } = useWalletModal();
  const [clicked, setClicked] = useState(false);
  const [fire, setFire] = useState(false);
  let domain: any = null;
  console.log(domain);
  const router = useRouter();
  //   const [balance, loading] = useSolBalance(publicKey?.toBase58()!);

  useEffect(() => {
    const req =
      !publicKey &&
      SolanaWallet &&
      SolanaWallet.readyState === "Installed" &&
      clicked;
    if (req) {
      try {
        connect();
      } catch (e) {
        console.error(e);
      }
      return;
    }
    if (publicKey) {
      console.log(`User Public Key: ${publicKey}`, domain);
      //   console.log(`User Balance: ${balance}`);
      if (!noToast) toast.success("Connected to Solana wallet", { id: "conn" });
      //   if (redirectToWelcome) router.push(`/welcome/${publicKey}`);

      if (setAddress) setAddress(publicKey.toString());

      //   if (setBalance) setBalance(balance?.toString());

      //   if (setWallet)
      //     setWallet({
      //       address: publicKey.toString(),
      //       balance: balance?.toString()!,
      //       type: "sol",
      //       domain: domain ?? null,
      //       chain: "SOL",
      //     });

      //   if (setWalletType) setWalletType("sol");
      //   onClose();
    }
  }, [SolanaWallet, visible, publicKey, redirectToWelcome, clicked, fire]);

  const handleConnect = async () => {
    setClicked(true);
    if (SolanaWallet) {
      toast.loading("disconnecting...", { id: "dis" });
      await SolanaWallet.adapter.disconnect();
      setAddress("");
      toast.success("disconnected", { id: "dis" });
      return;
    }
    console.log("Solana Wallet retrieved", SolanaWallet, domain);
    setVisible(true);
  };

  return <div onClick={handleConnect}>{children}</div>;
};
