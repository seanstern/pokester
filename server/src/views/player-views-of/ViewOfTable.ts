import { Table as PokerEngineTable } from "@chevtek/poker-engine";
import { Table as CommonAPITable } from "@pokester/common-api/poker-rooms/get";
import viewOfCard from "./ViewOfCard";
import viewOfPlayer from "./ViewOfPlayer";
import viewOfPot from "./ViewOfPot";

const viewOfTable = (viewerId: string, t: PokerEngineTable): CommonAPITable => {
  const {
    bigBlindPosition,
    currentBet,
    currentPosition,
    currentRound,
    dealerPosition,
    handNumber,
    smallBlindPosition,
    buyIn,
    smallBlind,
    bigBlind,
    communityCards: pokerEngineCommunityCards,
    players: pokerEnginePlayers,
    pots: pokerEnginePots,
    winners: pokerEngineWinners,
  } = t;

  return {
    bigBlindPosition,
    currentBet,
    currentPosition,
    currentRound,
    dealerPosition,
    handNumber,
    smallBlindPosition,
    buyIn,
    smallBlind,
    bigBlind,
    communityCards: pokerEngineCommunityCards.map((pokerEngineCommunityCard) =>
      viewOfCard(pokerEngineCommunityCard)
    ),
    players: pokerEnginePlayers.map((pokerEnginePlayer) =>
      pokerEnginePlayer === null
        ? null
        : viewOfPlayer(viewerId, pokerEnginePlayer)
    ),
    pots: pokerEnginePots.map((pokerEnginePot) =>
      viewOfPot(viewerId, pokerEnginePot)
    ),
    winners: pokerEngineWinners
      ? pokerEngineWinners.map((pokerEngineWinner) =>
          viewOfPlayer(viewerId, pokerEngineWinner)
        )
      : undefined,
  };
};

export default viewOfTable;
