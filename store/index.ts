export function state(){return {
    fireApiUrl :process.env.fireApiUrl,
    fireFrontUrl :process.env.fireFrontUrl,
    userInfoModalIsOpen:false,
}};

export var mutations ={
    openUserInfoModal(state){
        state.userInfoModalIsOpen =true;
    },
    closeUserInfoModal(state){
        state.userInfoModalIsOpen =false;
    },
};


export const actions= {
    async nuxtServerInit (store, context) {
        await store.dispatch('fetch/fetchBlogInfo');
    },
};
