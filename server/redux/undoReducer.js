const undoReducer = (reducer) => {
  const INITIAL_STATE = {
    past: [],
    present: reducer(undefined, {}),
    future: [],
  };

  return (state = INITIAL_STATE, action) => {
    const {past, present, future} = state;

    switch (action.type) {
      case 'UNDO':
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length -1);
        return {
          ...state,
          past: newPast,
          present: previous,
          future: [present, ...future],
        };

      case 'REDO':
        const next = future[0];
        const newFuture = future.slice(1);
        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        };

      default:
        const newPresent = reducer(present, action)
        if (present === newPresent) {
          return state;
        };
        return {
          past: [...past, present],
          present: newPresent,
          future: [],
        }
    }
  };
};

export default undoReducer;