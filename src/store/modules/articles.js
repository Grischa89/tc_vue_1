import axios from 'axios';

const state = {
    articleColumns: [],
    // articleColumns: ['heading', 'summary', 'paragraph', 'subheading', 'listarray', 'table'],
    articleRecommendations: null,
};

const getters = {
    articleColumns: state => {
        const mappedArticleColumns = state.articleColumns.map(element => {
            return { name: element, disabled: false };
        });
        
        return mappedArticleColumns;
    },

    articleRecommendations: state => {
        return state.articleRecommendations;
    }
};

const actions = {
    getArticleColumns({ commit }) {
        axios.get('/api/v1/articles/get_article_columns/')
        .then(res => {
            commit('setArticleColumns', res.data.columns);
        })
        .catch(err => {
            console.log('err', err);
        });
    },

    getArticleRecommendations({ commit }) {
        axios.get('/api/v1/articles/get_article_recommendations/')
        .then(res => {
            commit('setArticleRecommendations', res.data.recommendations);
        })
        .catch(err => {
            console.log('err', err);
        });
    },

    getArticles({ commit }) {
        axios.get('/api/v1/articles/')
        .then(res => {
            console.log('%cgetArticles', 'color: red; font-weight: bold;', res.data);
        })
        .catch(err => {
            console.log('err', err);
        });
    },

    postArticle({ commit }, article) {
        console.log('%carticle in postArticle', 'color: darkseagreen; font-weight: bold;', article);

        axios.post('/api/v1/articles/add/', article)
            .then(res => {
                console.log('%cres from postArticle', 'color: darkseagreen; font-weight: bold;', res);
            })
            .catch(err => {
                console.log('%cerr from postArticle', 'color: red; font-weight: bold;', err);
            });
    }
};

const mutations = {
    setArticleColumns(state, columns) {
        state.articleColumns = columns;
    },

    setArticleRecommendations(state, recommendations) {
        state.articleRecommendations = recommendations;
    }
};

export default {
  state, getters, actions, mutations
}