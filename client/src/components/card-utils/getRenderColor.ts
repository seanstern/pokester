import { PokerRooms } from "@pokester/common-api";

// The color of
// - ♥ from https://twemoji.maxcdn.com/v/latest/svg/2665.svg
// - ♦ from https://twemoji.maxcdn.com/v/latest/svg/2666.svg
const renderCardRed = "#BE1931";

// The color of
// - ♣ from https://twemoji.maxcdn.com/v/latest/svg/2663.svg
// - ♠ from https://twemoji.maxcdn.com/v/latest/svg/2666.svg
const renderCardBlack = "#31373D";

/**
 * Given a api based card color, returns the color that card should be rendered
 * in. Useful for aligning card rank render color to twemoji colors.
 *
 * @param color an api based card color
 * @returns a color to render in the app that is useful for aligning card rank
 *   render color to twemoji color
 */
const getCardRenderColor = (color: PokerRooms.Get.CardColor) =>
  color === PokerRooms.Get.CardColor.RED ? renderCardRed : renderCardBlack;

export default getCardRenderColor;
