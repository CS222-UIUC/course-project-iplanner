import { useContext } from "react";
import { CardCtx } from "../App";

// Prerequisite chain | immediate prerequisite | prereq or concur registration |
// courses that have this course as prechn/prereq | equivalent |
// current selected course | no relation
type Relation = "prechn" | "prereq" | "concur" | "subseq" | "equiv" | "curr" | "none";
export type Pattern = "fa_only" | "sp_only" | "not_recent" | "none";
export interface CardState {
  relation: Relation, // if this course has a relation to / is the hovered course
  searched: boolean, // if this course matches the search input
  missing: string[][], // missing prereqs/concur courses id
  pattern: Pattern, // if the course is against the pattern in course.pattern
}

export interface CardAction {
  id: string,
  type: string,
  missing?: string[][], // optional arg for missing prereq/concur chain
  relation?: Relation,
  pattern?: Pattern,
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
    case 'RELATION_SET':
      return update(cardStates, action.id, "relation", action.relation);
    case 'RELATION_CLEAR': // RELATION_SET with arg = "none"
      return update(cardStates, action.id, "relation", "none");
    case 'MISSING_SET':
      return update(cardStates, action.id, "missing", action.missing);
    case 'PATTERN_SET':
      return update(cardStates, action.id, "pattern", action.pattern);
    case 'PATTERN_CLEAR': // PATTERN_SET with arg = "none"
      return update(cardStates, action.id, "pattern", "none");
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
      type: `RELATION_SET`,
      relation
    })
  };
  const clearRelation = (id: string) => {
    cardDispatch({
      id,
      type: "RELATION_CLEAR"
    })
  }
  const setMissing = (id: string, missing: string[][]) => {
    cardDispatch({
      id,
      type: "MISSING_SET",
      missing
    })
  };
  const setPattern = (id: string, pattern: Pattern) => {
    cardDispatch({
      id,
      type: "PATTERN_SET",
      pattern
    })
  }
  const clearPattern = (id: string) => {
    cardDispatch({
      id,
      type: "PATTERN_CLEAR"
    })
  }

  return {
    setSearch,
    clearSearch,
    setRelation,
    clearRelation,
    setMissing,
    setPattern,
    clearPattern
  }
}

export default useCardActions;