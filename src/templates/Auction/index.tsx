import { Address, ProviderRpcClient } from "everscale-inpage-provider";
import Image from "next/image";
import nft_drake from "public/assets/images/nft_drake.png";
import { useEffect, useState } from "react";

// Do not forget about ABI. We need it to call our smart contracts!
import auctionAbi from "@/abi/Auction.abi.json";
import nftAbi from "@/abi/NFT.abi.json";
import tokenWalletAbi from "@/abi/TokenWallet.abi.json";
import Countdown from "@/components/Countdown";
// Store it somwhere....for example in separate files for constants
import { AUCTION_ADDRESS } from "@/utils/constants";
import {
  BaseNftJson,
  formatBalance,
  formatDate,
  getValueForSend,
} from "@/utils/helpers";

type AuctionProps = {
  address: string | undefined;
  balance: string | undefined;
  standaloneProvider: ProviderRpcClient | undefined;
  venomProvider: ProviderRpcClient | undefined;
  tokenWalletAddress: string | undefined;
  checkBalance: () => void;
};

type Participant = {
  address: string;
  tickets: string;
};

type NftAnswer = {
  _nft: Address;
};
/* tslint:disable */
const Auction = (props: AuctionProps) => {
  const {
    address,
    balance,
    standaloneProvider,
    venomProvider,
    tokenWalletAddress,
    checkBalance,
  } = props;

  // eslint-disable-next-line unused-imports/no-unused-vars
  // @ts-ignore
  const [isClaimDisabled, setIsClaimDisabled] = useState<boolean | undefined>(
    true
  );

  // @ts-ignore
  const [participants, setParticipants] = useState<
    Array<Participant> | undefined
  >([
    {
      address: "addr1qxdcfq...4jwdq6pahqc6",
      tickets: "10",
    },
    {
      address: "addr1qxdcfq...4jwdq6pahqc6",
      tickets: "10",
    },
    {
      address: "addr1qxdcfq...4jwdq6pahqc6",
      tickets: "10",
    },
    {
      address: "addr1qxdcfq...4jwdq6pahqc6",
      tickets: "10",
    },
    {
      address: "addr1qxdcfq...4jwdq6pahqc6",
      tickets: "10",
    },
    {
      address: "addr1qxdcfq...4jwdq6pahqc6",
      tickets: "10",
    },
  ]);

  const DAYS_IN_MS = 20 * 24 * 60 * 60 * 1000;
  const NOW_IN_MS = new Date().getTime();

  const dateTimeAfterThreeDays = NOW_IN_MS + DAYS_IN_MS;

  const auctionContract = standaloneProvider
    ? new standaloneProvider.Contract(auctionAbi, new Address(AUCTION_ADDRESS))
    : undefined;
  // Some state variables from Auction smart contract. You can just check ABI.
  const [nftUrl, setNftUrl] = useState<string | undefined>();
  const [_, setCurrentBid] = useState<string | undefined>();
  const [currentWinner, setCurrentWinner] = useState<string | undefined>();
  const [endTime, setEndTime] = useState<string | undefined>();
  const [needUpdate, setNeedUpdate] = useState(false);
  const [tokenAmount, setTokenAmount] = useState<number | undefined>(0);

  const getNftAddress = async (): Promise<Address | undefined> => {
    if (!auctionContract) return undefined;
    // @ts-ignore
    const answer = (await auctionContract.methods
      ._nft({} as never)
      .call()) as NftAnswer;
    if (!answer) return undefined;
    return answer._nft;
  };

  // we need to read the NFT contract here to get NFT itself (NFT data json)
  const getNftUrl = async (
    provider: ProviderRpcClient,
    nftAddress: Address
  ): Promise<string> => {
    const nftContract = new provider.Contract(nftAbi, nftAddress);
    // @ts-ignore
    const result = (await nftContract.methods
      .getJson({ answerId: 0 } as never)
      .call()) as { json: string };
    const json = JSON.parse(result.json ?? "{}") as BaseNftJson;
    return json.preview?.source || "";
  };

  // loadNFT - get NFT address from Auction contract and get data from NFT contract
  const loadNft = async (provider: ProviderRpcClient) => {
    const nftAddress = await getNftAddress();
    if (!nftAddress) return;
    const _nftUrl = await getNftUrl(provider, nftAddress);
    if (!_nftUrl) return;
    setNftUrl(_nftUrl);
  };

  const getCurrentBid = async (): Promise<string | undefined> => {
    if (!auctionContract) return undefined;
    // @ts-ignore
    const { _currentBid } = await auctionContract.methods
      ._currentBid({} as never)
      .call();
    return formatBalance(_currentBid) || "0";
  };

  const getCurrentWinner = async (): Promise<string | undefined> => {
    if (!auctionContract) return undefined;
    // @ts-ignore
    const result = (await auctionContract.methods
      ._currentWinner({} as never)
      .call()) as any;
    return result._currentWinner._address;
  };

  const getEndTime = async (): Promise<string | undefined> => {
    if (!auctionContract) return undefined;
    // @ts-ignore
    const { _endTime } = await auctionContract.methods
      ._endTime({} as never)
      .call();
    return formatDate(_endTime);
  };

  // Bring it all together :) We need it for hook
  const loadAuctionInfo = async (provider: ProviderRpcClient) => {
    try {
      await loadNft(provider);
      const _currentBid = await getCurrentBid();
      setCurrentBid(_currentBid);
      const _currentWinner = await getCurrentWinner();
      setCurrentWinner(_currentWinner);
      const _endTime = await getEndTime();
      setEndTime(_endTime);
    } catch (e) {
      console.error(e);
    }
  };

  const updateData = async () => {
    await checkBalance();
    const _currentBid = await getCurrentBid();
    setCurrentBid(_currentBid);
    const _currentWinner = await getCurrentWinner();
    setCurrentWinner(_currentWinner);
    setNeedUpdate(false);
  };

  const onChangeAmount = (e: string) => {
    if (e === "") setTokenAmount(undefined);
    if (Number(e) <= Number(balance)) setTokenAmount(Number(e));
  };

  // main function of all dAPP! :)
  const bet = async () => {
    try {
      if (!venomProvider || !tokenAmount) return;
      // TokenWallet address was passed here from somewhere (from NftAuction component)
      const tokenWalletContract = new venomProvider.Contract(
        tokenWalletAbi,
        new Address(tokenWalletAddress as string)
      );
      // Just a common call of smart contract, nothing special and pretty easy
      // The only one difference - usage of .send() function
      // When we use send(), firstly we call our venom wallet (logged user's wallet) and then venom wallet will call our target contract internally (by sendTransaction method)
      // So you need to call send() when you own callee internally (by wallet address)
      // @ts-ignore
      const result = await tokenWalletContract.methods
        .transfer({
          amount: getValueForSend(tokenAmount),
          recipient: new Address(AUCTION_ADDRESS),
          deployWalletValue: 0,
          remainingGasTo: new Address(address as string),
          notify: true,
          payload: "",
        } as never)
        .send({
          from: new Address(address as string),
          amount: getValueForSend(1),
          bounce: true,
        });
      if (result?.id?.lt && result?.endStatus === "active") {
        // when our tx is success we need to refresh parent component with new data
        setNeedUpdate(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Main hooks for loading and updating our info
  useEffect(() => {
    if (standaloneProvider) loadAuctionInfo(standaloneProvider);
  }, [standaloneProvider]);

  useEffect(() => {
    if (needUpdate && standaloneProvider) updateData();
  }, [needUpdate]);

  // @ts-ignore
  return (
    <div id="auction" className="pt-32 text-slate-800">
      <div className="container px-5">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <h2 className="text-4xl font-bold text-white">Ada Raffles</h2>
            <div className="mt-5 flex gap-3">
              <div className="focus:ring-ring hover:bg-secondary/80 text-secondary-foreground inline-flex items-center rounded-full border px-5 py-1.5 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2">
                PFP
              </div>
              <div className="focus:ring-ring hover:bg-secondary/80 text-secondary-foreground inline-flex items-center rounded-full border px-5 py-1.5 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2">
                Utility
              </div>
            </div>
            <p className="text-md mb-5 mt-10 text-white">
              The first revenue-sharing raffles and auction platform on Cardano
              give back a huge percentage of earned fees to holders,
              contributors.
            </p>
            <p className="text-md mb-5 text-white">
              With its new platform, collectors have a chance to raffle their
              NFTs, and artists have enormous opportunities to showcase their
              masterpieces to the world.
            </p>
            <p className="text-md mb-10 text-white">
              Participation in the first Tap Tools raffle grants users a
              whitelist spot in the future 'Degens Time Collection' collection.
            </p>
            <div className="flex space-x-5">
              <a
                href="https://twitter.com/bearstudio_NFT"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://discord.gg/XgxDfykqMr"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                <span className="sr-only">Discord</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-brand-discord-filled"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.732 0 -1.693 -.968 -2.328 -2.045a21.512 21.512 0 0 0 2.103 -.493a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.717 .204 1.416 .37 2.103 .494c-.635 1.075 -1.596 2.044 -2.328 2.044c-1.788 0 -3.391 -1.548 -4.428 -3.629c-.888 -2.217 -.39 -6.89 1.485 -12.204a1 1 0 0 1 .371 -.488c1.439 -1.001 2.952 -1.459 4.966 -1.673a1 1 0 0 1 .935 .435l.063 .107l.651 1.285l.137 -.016a12.97 12.97 0 0 1 2.643 0l.134 .016l.65 -1.284a1 1 0 0 1 .754 -.54l.122 -.009zm-5.983 7a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z"
                    strokeWidth="0"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div>
            {nftUrl ? (
              <Image
                src={nftUrl}
                alt="polar_nft"
                width="400"
                height="400"
                className="w-full"
              />
            ) : (
              <Image
                src={nft_drake}
                alt="polar_nft"
                width="400"
                height="400"
                className="w-full"
              />
            )}
            <div className="mt-5 flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:gap-20">
              <div className="text-center">
                <Countdown targetDate={dateTimeAfterThreeDays} />
              </div>
            </div>
          </div>
          <div className="self-start text-start">
            <div className="grid w-full items-start gap-5">
              <h3 className="text-2xl font-bold text-white">
                Ticket Costs: 10 ADA
              </h3>
              <input
                type="number"
                className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border bg-white p-6 text-lg file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="bid"
                min={0}
                value={tokenAmount !== undefined ? tokenAmount : ""}
                onChange={(e) => {
                  onChangeAmount(e.target.value);
                }}
              />
              <button
                type="button"
                className={`${
                  !tokenAmount ? "btn disabled" : "btn"
                } focus-visible:ring-ring ring-offset-background text-primary-foreground inline-flex h-11 w-full items-center justify-center rounded-md bg-emerald-400 px-8 text-2xl font-bold text-white transition-colors hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`}
                onClick={bet}
              >
                BUY
              </button>
              <button
                type="button"
                disabled={isClaimDisabled}
                className={`${
                  isClaimDisabled
                    ? "disabled:pointer-events-none disabled:opacity-50"
                    : ""
                } focus-visible:ring-ring ring-offset-background button_claim text-primary-foreground hover:bg-primary/90 inline-flex h-11 w-full items-center justify-center rounded-md px-8 text-2xl font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
              >
                CLAIM
              </button>
              {currentWinner && <p id="copyText">{currentWinner}</p>}
              <div className="flex justify-between max-[430px]:flex-col max-[430px]:gap-y-5">
                <h2 className="text-lg font-bold">
                  <span className="text-white">Tickets All</span>
                  <span className="ml-3 rounded rounded-md bg-black px-5 py-3 text-white">
                    555
                    {endTime && <b>{endTime} UTC</b>}
                  </span>
                </h2>
                <h2 className="text-lg font-bold">
                  <span className="text-white">Remaining</span>
                  <span className="ml-3 rounded rounded-md bg-black px-5 py-3 text-white">
                    38
                  </span>
                </h2>
              </div>
              {participants && (
                <div>
                  <h3 className="mt-6 text-2xl font-bold text-white">
                    Participants:
                  </h3>
                  <ul className="participants_list mt-9 rounded-md bg-white p-2.5 pr-4">
                    {participants?.map((participant, index) => (
                      <li
                        key={index}
                        className="participant flex justify-between font-bold text-black"
                      >
                        <p className="text-md">{participant.address}</p>
                        <p className="text-md">{participant.tickets}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;
