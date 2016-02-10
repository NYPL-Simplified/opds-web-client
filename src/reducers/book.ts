const initialState = null;

const book = (state = initialState, action) => {
  switch (action.type) {
    case "SHOW_BOOK_DETAILS":
      return action.book;

    case "HIDE_BOOK_DETAILS":
      return null;

    default:
      return state;
  }
};

export default book;