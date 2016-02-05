const initialState = {
  url: null,
  data: null,
  isLoading: false
};

const collection = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_COLLECTION':
      return {
        url: action.url,
        data: state.data,
        isLoading: true        
      };

    case 'LOAD_COLLECTION':
      return {
        url: action.url,
        data: action.data,
        isLoading: false
      };

    default:
      return state;
  }
}

export default collection;