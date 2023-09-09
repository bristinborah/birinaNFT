import Image, { StaticImageData } from "next/image";

type AuctionCardProps = {
  collectionName: string;
  image: string | StaticImageData;
  cardName: string;
};

const AuctionCard = (props: AuctionCardProps) => {
  const { collectionName, image, cardName } = props;

  return (
    <div>
      <Image
        src={image}
        alt={cardName}
        width="243"
        height="243"
        className="mb-3 w-full"
      />
      <h3 className="text-4xl text-white">{collectionName}</h3>
      <h4 className="text-2xl text-white">{cardName}</h4>
    </div>
  );
};

export default AuctionCard;
