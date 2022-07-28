import axios from 'axios';

const state = {
    articleSections: [],
    // articleSections: ['heading', 'summary', 'paragraph', 'subheading', 'listarray', 'table'],
    articleRecommendations: null,

    articles: null,

    articleRaw: {},

    article: {},
};

const getters = {
    articleSections: state => {
        const mappedArticleSections = state.articleSections.map(element => {
            return { name: element, disabled: false };
        });
        
        return mappedArticleSections;
    },

    articleRecommendations: state => {
        return state.articleRecommendations;
    },
    
    articles: state => {
        return state.articles;
    },

    articleContent: state => {
        if (state.article?.meta_data) {
            const order = state.article.meta_data.order;
            const article = JSON.parse(JSON.stringify(state.article?.draggable_data));

            const articleForDisplay = [];
            const articleForForm = order.map(element => {

                // Get index of object in article array where key's value is 'element'
                const i = article.findIndex((item, index, array) => {
                    return item.key === `${element}`
                });

                // Handle listarrays since they need to be split for articleForDisplay
                if (element === 'listarray') {
                    const section = article[i];
                    // Preserve article[i] for articleForForm (if not 'value' will be mutated as for articleForDisplay)
                    const listarray = JSON.parse(JSON.stringify(article[i]));
                    listarray.value = listarray.value.split(';');
                    articleForDisplay.push(listarray);

                    article.splice(i, 1);
                    return section;
                }

                // Handle tables since they need to be split for articleForDisplay
                if (element === 'table') {
                    const section = article[i];
                    // Preserve article[i] for articleForForm (if not 'value' will be mutated as for articleForDisplay)
                    const table = JSON.parse(JSON.stringify(article[i]));
                    table.table_head = table.table_head.split(',');
                    const numberOfColumns = table.table_head.length;
                    table.value = table.value.split(',');
                    table.rows = [];

                    // Create array of arrays with length of numberOfColumns
                    for (let i = 0; i < table.value.length; i+= numberOfColumns) {
                        const row = table.value.slice(i, i + numberOfColumns);
                        table.rows.push(row);
                    }
                    articleForDisplay.push(table);

                    article.splice(i, 1);
                    return section;
                }

                const section = article[i];
                articleForDisplay.push(article[i]);
                article.splice(i, 1);

                return section;
            });

            return { articleForForm: articleForForm, articleForDisplay: articleForDisplay };
        }
    },

    articleMeta: state => {
        return state.article?.meta_data;
    }
};

const actions = {
    getArticleSections({ commit }) {
        axios.get('/api/v1/articles/get_article_columns/')
        .then(res => {
            commit('setArticleSections', res.data.columns);
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

    getArticleJSON({ commit }, slug) {
        console.log('%cslug', 'color: darkseagreen; font-weight: bold;', slug);

        axios.get(`/api/v1/articles/${slug}`)
            .then(res => {
                console.log('%cres getArticleJSON', 'color: darkseagreen; font-weight: bold;', res.data);
                commit('setArticleRaw', res.data);
            })
            .catch(err => {
                console.log('%cerr getArticleJSON', 'color: red; font-weight: bold;', err);
            });
    },

    getArticle({ commit }, slug) {

        axios.get(`/api/v1/articles/draggable/${slug}`)
            .then(res => {
                console.log('%cres getArticle', 'color: darkseagreen; font-weight: bold;', res);
                commit('setArticle', res.data);
            })
            .catch(err => {
                console.log('%cerr getArticle', 'color: red; font-weight: bold;', err);
            });
    },

    postArticle({ commit }, article) {
        console.log('%carticle in postArticle', 'color: darkseagreen; font-weight: bold;', article);

        return axios.post('/api/v1/articles/add/', article)
            .then(res => {
                console.log('%cres from postArticle', 'color: darkseagreen; font-weight: bold;', res);
                return res.status;
            })
            .catch(err => {
                console.log('%cerr from postArticle', 'color: red; font-weight: bold;', err);
            });
    },

    updateArticle({ commit }, data) {
        console.log('%cupdateArticle', 'color: orange; font-weight: bold;', data);

        return axios.put(`/api/v1/articles/${data.slug}/`, data.article)
            .then(res => {
                console.log('%cres in updateArticle', 'color: orange; font-weight: bold;', res);
                return res.status;
            })
            .catch(err => {
                console.log('%cerr in updateArticle', 'color: darkseagreen; font-weight: bold;', err);
            });
    }
};

const mutations = {
    setArticleSections(state, columns) {
        state.articleSections = columns;
    },

    setArticleRecommendations(state, recommendations) {
        state.articleRecommendations = recommendations;
    },

    setArticles(state, articles) {
        state.articles = articles;
    },

    setArticleRaw(state, article) {
        state.articleRaw = article;
    },
    setArticle(state, article) {
        state.article = article;
    }
};

export default {
  state, getters, actions, mutations
}