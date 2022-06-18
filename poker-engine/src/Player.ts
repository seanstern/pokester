import { Hand } from "pokersolver";
import { Card, Table } from ".";

export class Player {
  bet: number = 0;
  raise?: number;
  holeCards?: [Card, Card];
  folded: boolean = false;
  showCards: boolean = false;
  left: boolean = false;

  constructor(
    public id: string,
    public stackSize: number,
    public table: Table
  ) {}

  get hand() {
    if (!this.holeCards) return null;
    return Hand.solve(
      this.holeCards
        .concat(this.table.communityCards)
        .map((card) => `${card.rank}${card.suit}`)
    );
  }

  betAction(amount: number) {
    if (this !== this.table.currentActor) {
      throw new Error("Action invoked on player out of turn!");
    }
    if (!this.legalActions().includes("bet")) {
      throw new Error("Illegal action.");
    }
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Amount was not a valid number.");
    }
    const currentBet = this.table.currentBet;
    if (currentBet)
      throw new Error("Illegal action. There is already a bet on the table.");
    if (amount < this.table.bigBlind) {
      throw new Error("A bet must be at least as much as the big blind.");
    } else if (amount > this.stackSize) {
      throw new Error("You cannot bet more than you brought to the table.");
    }
    this.raiseAction(amount);
  }

  callAction() {
    if (this !== this.table.currentActor) {
      throw new Error("Action invoked on player out of turn!");
    }
    if (!this.legalActions().includes("call")) {
      throw new Error("Illegal action.");
    }
    const currentBet = this.table.currentBet;
    if (!currentBet)
      throw new Error("Illegal action. There is no bet to call.");
    const callAmount = currentBet - this.bet;
    // All-in via inability to call
    if (callAmount > this.stackSize) {
      // Add stack to current bet and empty stack;
      this.bet += this.stackSize;
      this.stackSize = 0;
    } else {
      delete this.raise;
      this.stackSize -= callAmount;
      this.bet += callAmount;
    }
    this.table.nextAction();
  }

  raiseAction(amount: number) {
    if (this !== this.table.currentActor) {
      throw new Error("Action invoked on player out of turn!");
    }
    const legalActions = this.legalActions();
    if (!legalActions.includes("raise") && !legalActions.includes("bet")) {
      throw new Error("Illegal action.");
    }
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Amount was not a valid number.");
    }
    if (amount > this.stackSize) {
      throw new Error("You cannot bet more than you brought to the table.");
    }
    const currentBet = this.table.currentBet;
    const lastRaise = this.table.lastRaise;
    const minRaiseByAmount = lastRaise ?? this.table.bigBlind;
    const raiseByAmount = currentBet ? amount + this.bet - currentBet : amount;
    // Do not allow the raise if it's less than the minimum and they aren't going all-in.
    if (raiseByAmount < minRaiseByAmount && amount < this.stackSize) {
      if (currentBet) {
        throw new Error(
          `You must raise the table bet by at least \`$${minRaiseByAmount}\` (making the table bet \`$${
            minRaiseByAmount + currentBet
          }\`), or you can go all-in.`
        );
      } else {
        throw new Error(
          `You must bet at least \`$${minRaiseByAmount}\`, or you can go all-in.`
        );
      }
    } else if (raiseByAmount < minRaiseByAmount && amount == this.stackSize) {
      // When the all-in player is raising for less than the minimum raise then increase the bet amount but do not change last raise value.
      this.bet += this.stackSize;
      this.stackSize = 0;
      this.table.currentBet = this.bet;
    } else {
      // this condition means (raiseByAmount >= minRaiseByAmount)
      this.stackSize -= amount;
      this.bet += amount;
      this.table.currentBet = this.bet;
      // Only mark raise values if there is a current bet.
      if (currentBet) {
        this.raise = this.table.lastRaise = this.bet - currentBet;
      }
      // Set last action to the player behind this one.
      this.table.lastPosition = this.table.currentPosition! - 1;
      if (this.table.lastPosition === -1)
        this.table.lastPosition = this.table.players.length - 1;
      while (
        !this.table.lastActor ||
        !this.table.actingPlayers.includes(this.table.lastActor)
      ) {
        this.table.lastPosition--;
        if (this.table.lastPosition === -1)
          this.table.lastPosition = this.table.players.length - 1;
      }
    }

    this.table.nextAction();
  }

  checkAction() {
    if (this !== this.table.currentActor) {
      throw new Error("Action invoked on player out of turn!");
    }
    if (!this.legalActions().includes("check")) {
      throw new Error("Illegal action.");
    }
    this.table.nextAction();
  }

  foldAction() {
    if (this !== this.table.currentActor) {
      throw new Error("Action invoked on player out of turn!");
    }
    if (!this.legalActions().includes("fold")) {
      throw new Error("Illegal action.");
    }
    this.folded = true;
    this.table.nextAction();
  }

  legalActions() {
    const currentBet = this.table.currentBet;
    const lastRaise = this.table.lastRaise;
    const actions: string[] = [];
    if (!currentBet) {
      actions.push("check", "bet");
    } else {
      if (this.bet === currentBet) {
        actions.push("check");
        if (this.table.actingPlayers.length > 0 && this.stackSize > 0) {
          actions.push("raise");
        }
      }
      if (this.bet < currentBet) {
        actions.push("call");
        if (
          this.stackSize > currentBet - this.bet &&
          this.table.actingPlayers.length > 0 &&
          (!lastRaise || !this.raise || lastRaise >= this.raise)
        ) {
          actions.push("raise");
        }
      }
    }
    actions.push("fold");
    return actions;
  }
}
