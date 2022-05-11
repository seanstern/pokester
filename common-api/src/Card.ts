import { Card as PokerEngineCard } from "@chevtek/poker-engine";

type Card = Pick<PokerEngineCard, "rank" | "suit" | "color" | "suitChar">;

export default Card;
