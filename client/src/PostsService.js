import Api from './Api';

export default {
    fetchPosts() {
        console.log('in API');

        return Api().get('posts');
    }
};
