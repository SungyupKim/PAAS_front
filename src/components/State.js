const resourcesReducer = (state, action) => {
    switch (action.type) {
        case 'RESOURCES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case 'RESOURCES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };
        case 'RESOURCES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        default:
            throw new Error();
    }
};

const clickReducer = (state, action) => {
    switch (action.type) {
        case 'RESOURCES_FETCH_INIT':
            return {
                ...state,
                isInit: true,
                isClicked: false,
            };
        case 'RESOURCES_CLICKED':
            return {
                ...state,
                isInit: false,
                isClicked: true,
            };
        default:
            throw new Error();
    }
};

export { clickReducer };
export default resourcesReducer;