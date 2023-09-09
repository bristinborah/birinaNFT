import nft_img_1 from "public/assets/images/nft_img_1.png";
import nft_img_2 from "public/assets/images/nft_img_2.png";
import nft_img_3 from "public/assets/images/nft_img_3.png";
import nft_img_4 from "public/assets/images/nft_img_4.png";

import AuctionCard from "@/components/AuctionCard";

const UpcomingAuctions = () => {
  return (
    <div id="upcoming-auction" className="py-24">
      <div className="container px-5">
        <div
          data-orientation="horizontal"
          role="none"
          className="my-4 h-[4px] w-full shrink-0 bg-white"
        />
        <h2 className="mb-6 scroll-m-20 pb-2 text-white text-center text-5xl font-bold tracking-tight transition-colors first:mt-0">
          Upcoming Auctions
        </h2>
        <div className="container flex max-w-6xl flex-col justify-between gap-10 lg:flex-row">
          <AuctionCard
            collectionName="Loading..."
            image={nft_img_1}
            cardName="Soon"
          />
          <AuctionCard
            collectionName="Loading..."
            image={nft_img_2}
            cardName="Soon"
          />
          <AuctionCard
            collectionName="Loading..."
            image={nft_img_3}
            cardName="Soon"
          />
          <AuctionCard
            collectionName="Loading..."
            image={nft_img_4}
            cardName="Soon"
          />
        </div>
      </div>
    </div>
  );
};

export default UpcomingAuctions;
