const initialState = {
  url: null,
  data: null,
  isFetching: false
};

const collection = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_COLLECTION':
      return {
        url: action.url,
        data: state.data,
        isFetching: true
      };

    case 'LOAD_COLLECTION':
      return {
        url: action.url,
        data: action.data,
        isFetching: false
      };

    default:
      return state;
  }
}

export default collection;