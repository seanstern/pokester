import { PokerRooms } from "@pokester/common-api";
import emoji from "react-easy-emoji";

/**
 * Given an api based suit character, returns an image-based emoji for that
 * suit character. Useful for ensuring cross-platform consistency of card
 * suits.
 *
 * @param suitChar a suit character, one of ♣ ♦ ♥ ♠
 * @returns an image-based emoji
 */
const getSuitCharImg = (suitChar: PokerRooms.Get.Card["suitChar"]) =>
  emoji(suitChar);

export default getSuitCharImg;
