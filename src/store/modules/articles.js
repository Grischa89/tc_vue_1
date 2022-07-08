import axios from 'axios';

const state = {
    articleColumns: [],
    // articleColumns: ['heading', 'summary', 'paragraph', 'subheading', 'listarray', 'table'],
    articleRecommendations: null,

    articles: null,

    article: null,
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
    },
    
    articles: state => {
        return state.articles;
    },

    displayArticle: state => {
        // const order = state.article?.order;
        // const articleTexts = state.article.filter(item => )

        // const content = state.article;
        // const order = content.order;
        // delete content.slug;
        // delete content.order;

        // for (const key in content) {
        //     if ((key === 'table' && content[key].headers_1 === null) || content[key] === null) delete content[key];
        // }

        // let keys = Object.keys(content);
        // = content.map(element => {
        //     // Object.keys() returns an array: ['heading']
        //     return Object.keys(element);
        // });


        // console.log('%ctype', 'color: darkseagreen; font-weight: bold;', keys, order);
        return state.article;
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
            console.log('%cgetArticles', 'color: crimson; font-weight: bold;', res.data);
            commit('setArticles', res.data);
        })
        .catch(err => {
            console.log('err', err);
        });
    },

    getArticle({ commit }, slug) {
        console.log('%cslug', 'color: darkseagreen; font-weight: bold;', slug);

        axios.get(`/api/v1/articles/${slug}`)
            .then(res => {
                console.log('%cres', 'color: darkseagreen; font-weight: bold;', res.data);
                commit('setArticle', res.data);
            })
            .catch(err => {
                console.log('%cerr', 'color: red; font-weight: bold;', err);
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
    },

    setArticles(state, articles) {
        state.articles = articles;
    },

    setArticle(state, article) {
        state.article = article;
    }
};

export default {
  state, getters, actions, mutations
}