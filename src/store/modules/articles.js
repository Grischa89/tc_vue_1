import axios from 'axios';

const state = {
    articleSections: [],
    // articleSections: ['heading', 'summary', 'paragraph', 'subheading', 'listarray', 'table'],
    articleRecommendations: null,

    articles: null,

    article: null,
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

    displayArticle: state => {
        if (state.article?.order) {
            const article = state.article;
            const order = state.article.order;
            delete article.slug;
            delete article.order;

            // Sort out sections that have null value
            for (const section in article) {
                if ((section === 'table' && article[section].shape_1 === null) || article[section] === null) delete article[section];
            }
            // Necessary to keep track of possible tables (1-3)
            let tableCounter = 0;

            // According to the order of elements of order array create new loopable array
            const articleOrdered = order.map(element => {
                // Object to be returned from map
                const articleRow = {
                    section: '',
                    content: {}
                };

                // Section value is of type array (subheading, sub_subheading, paragraph, listarray)
                if (Array.isArray(article[`${element}`])) {
                    articleRow.section = element;
                    articleRow.content = element === 'listarray' ? article[`${element}`][0].split(';') : article[`${element}`][0];
                    article[`${element}`].shift();
                    return articleRow;
                }

                // Section value is of type object (table)
                if (!Array.isArray(article[`${element}`]) && typeof article[`${element}`] === 'object') {
                    tableCounter++;

                    // Make sure table exists
                    if (article[`${element}`][`shape_${tableCounter}`].length > 0) {
                        const numberOfColumns = parseInt
                        (article[`${element}`][`shape_${tableCounter}`].split(',')[1]);

                        const columns = article[`${element}`][`table_head_${tableCounter}`];
                        // Array that will contain rows (as arrays)
                        const rows = [];

                        // Increment in steps of # of columns
                        for (let i = 0; i < article[`${element}`][`table_text_${tableCounter}`].length; i+= numberOfColumns) {
                            const row = article[`${element}`][`table_text_${tableCounter}`].slice(i, i + numberOfColumns);
                            rows.push(row);
                        }

                        articleRow.section = element;
                        articleRow.content['columns'] = columns;
                        articleRow.content['rows'] = rows;
                        return articleRow;
                    }
                }

                // Section that only occurs once (heading, summary)
                articleRow.section = element;
                articleRow.content = article[`${element}`];

                return articleRow;
            });

            return articleOrdered;
        }
    },

    displayArticleMeta: state => {
        const articleMeta = {
            created: state.article?.created,
            updated: state.article?.updated
        }

        return articleMeta;
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

    getArticle({ commit }, slug) {
        console.log('%cslug', 'color: darkseagreen; font-weight: bold;', slug);

        axios.get(`/api/v1/articles/${slug}`)
            .then(res => {
                const art = res.data;
                console.log('%cres', 'color: darkseagreen; font-weight: bold;', res.data);
                commit('setArticle', art);
            })
            .catch(err => {
                console.log('%cerr', 'color: red; font-weight: bold;', err);
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

    setArticle(state, article) {
        state.article = article;
    }
};

export default {
  state, getters, actions, mutations
}