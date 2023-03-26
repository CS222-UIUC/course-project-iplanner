import { useContext } from "react";
import { CardCtx } from "../App";

export interface CardState {
  highlight: "prereq" | "concur" | "subseq" | "equiv",
  searched: boolean
}

export interface CardAction {
  id: string,
  type: string
}

// Handles different CardActions and changes corresponding cardStates.
// Note the "updating a field of a complex object" syntax used.
export function cardReducer(cardStates: Record<string, CardState>, action: CardAction) {
  switch (action.type) {
    case 'SEARCH_SET':
      return {
        ...cardStates,
        [action.id]: {
          ...cardStates[action.id],
          searched: true
        }
      };
    case 'SEARCH_CLEAR':
      return {
        ...cardStates,
        [action.id]: {
          ...cardStates[action.id],
          searched: false
        }
      };
    default:
      return cardStates;
  }
}

// Returns "toolkit" functions that dispatches state change events.
// useCardActions has to be a self-defined hook since it contains useContext();
// this means useCardActions must be called at *top level of component*.
// See SearchBar.tsx for details.
function useCardActions() {
  const { cardDispatch } = useContext(CardCtx);

  const setSearch = (id: string) => {
    cardDispatch({
      id,
      type: "SEARCH_SET"
    });
  };
  const clearSearch = (id: string) => {
    cardDispatch({
      id,
      type: "SEARCH_CLEAR"
    });
  };

  return {
    setSearch,
    clearSearch
  }
}

export default useCardActions;