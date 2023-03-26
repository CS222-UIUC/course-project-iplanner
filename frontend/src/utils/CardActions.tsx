import { useContext } from "react";
import { CardCtx } from "../App";

// Prerequisite chain | immediate prerequisite | prereq or concur registration |
// courses that have this course as prechn/prereq | equivalent |
// current selected course | no relation
type Relation = "prechn" | "prereq" | "concur" | "subseq" | "equiv" | "curr" | "none";
export interface CardState {
  relation: Relation,
  searched: boolean
}

export interface CardAction {
  id: string,
  type: string
}

// Handles different CardActions and changes corresponding cardStates.
// Note the "updating a field of a complex object" syntax used.
export function cardReducer(cardStates: Record<string, CardState>, action: CardAction) {
  const update = (cardStates: Record<string, CardState>, id: string, key: string, value: any) => {
    return {
      ...cardStates,
      [id]: {
        ...cardStates[id],
        [key]: value
      }
    }
  }

  switch (action.type) {
    case 'SEARCH_SET':
      return update(cardStates, action.id, "searched", true);
    case 'SEARCH_CLEAR':
      return update(cardStates, action.id, "searched", false);
    case 'RELATION_PRECHN':
      return update(cardStates, action.id, "relation", "prechn");
    case 'RELATION_PREREQ':
      return update(cardStates, action.id, "relation", "prereq");
    case 'RELATION_CONCUR':
      return update(cardStates, action.id, "relation", "concur");
    case 'RELATION_SUBSEQ':
      return update(cardStates, action.id, "relation", "subseq");
    case 'RELATION_EQUIV':
      return update(cardStates, action.id, "relation", "equiv");
    case 'RELATION_CURR':
      return update(cardStates, action.id, "relation", "curr");
    case 'RELATION_NONE':
      return update(cardStates, action.id, "relation", "none");
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
  const setRelation = (id: string, relation: Relation) => {
    cardDispatch({
      id,
      type: `RELATION_${relation.toUpperCase()}`
    })
  };
  const clearRelation = (id: string) => {
    cardDispatch({
      id,
      type: "RELATION_NONE"
    })
  }

  return {
    setSearch,
    clearSearch,
    setRelation,
    clearRelation
  }
}

export default useCardActions;