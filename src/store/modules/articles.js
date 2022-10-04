import axios from 'axios';

const state = {
    articleSections: [],
    // articleSections: ['heading', 'summary', 'paragraph', 'subheading', 'listarray', 'table'],

    uniqueSections: ['heading', 'summary'],

    articleRecommendations: null,

    articles: null,

    articleRaw: {},

    article: {},

    articleValidationErrors: [],

    singleArticleLoadStatus: null,
};

const getters = {
    articleSections: state => {
        const sortAlph = JSON.parse(JSON.stringify(state.articleSections));
        sortAlph.sort((first, second) => {
            if (first.name > second.name) return 1;
            return -1;
        });

        return sortAlph;
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
                    section.id = Math.floor(Date.now() * Math.random());
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
                    section.id = Math.floor(Date.now() * Math.random());
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
                section.id = Math.floor(Date.now() * Math.random());
                articleForDisplay.push(article[i]);
                article.splice(i, 1);

                return section;
            });

            return { articleForForm: articleForForm, articleForDisplay: articleForDisplay };
        }
    },

    articleMeta: state => {
        return state.article?.meta_data;
    },

    articleValidationErrors: state => {
        return state.articleValidationErrors;
    },

    singleArticleLoadStatus: state => {
        return state.singleArticleLoadStatus;
    }
};

const actions = {
    getArticleSections({ commit }) {
        return axios.get('/api/v1/articles/get_article_columns/')
        .then(res => {
            commit('setDisabledPropOnArticleSections', res.data.columns);
            return res.status;
        })
        .catch(err => {
            console.log('err', err);
        });
    },

    setDisabledSectionValuesBasedOnArticle({ dispatch, commit, state }, article) {
        // NOTE: forEach needs to be marked with async keyword (and not the higher level function setDisabledSectionValuesBasedOnArticle), because it is the directly enclosing function of the await keyword
        article.forEach(async element => {
            if (!element.key) {
                commit('setDisabledValueOnArticleSections', { sectionIndex: -1, isDisabled: false });
            }

            if (state.uniqueSections.includes(element.key)) {
                const i = await dispatch('findIndexOfUniqueSection', element.key);
                commit('setDisabledValueOnArticleSections', { sectionIndex: i, isDisabled: true });
            }
        })
    },

    findIndexOfUniqueSection({ commit }, uniqueSection) {
        const index = state.articleSections.findIndex(object => {
            return object.name === uniqueSection;
        });

        return index;
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
        axios.get('/api/v1/articles/all/')
        .then(res => {
            commit('setArticles', res.data);
        })
        .catch(err => {
            console.log('err', err);
        });
    },

    getArticleJSON({ commit }, slug) {
        console.log('%cslug', 'color: darkseagreen; font-weight: bold;', slug);

        axios.get(`/api/v1/articles/${slug}/`)
            .then(res => {
                console.log('%cres getArticleJSON', 'color: darkseagreen; font-weight: bold;', res.data);
                commit('setArticleRaw', res.data);
            })
            .catch(err => {
                console.log('%cerr getArticleJSON', 'color: red; font-weight: bold;', err);
            });
    },

    getArticle({ commit }, slug) {

        commit('setSingleArticleLoadStatus', 'loading');

        return axios.get(`/api/v1/articles/draggable/${slug}/`)
            .then(res => {
                console.log('%cres getArticle', 'color: darkseagreen; font-weight: bold;', res);
                commit('setArticle', res.data);
                commit('setSingleArticleLoadStatus', 'success');
                return res.status
            })
            .catch(err => {
                console.log('%cerr getArticle', 'color: red; font-weight: bold;', err);
                commit('setSingleArticleLoadStatus', 'error');
            });
    },

    postArticle({ commit }, article) {
        console.log('%carticle in postArticle + type', 'color: darkseagreen; font-weight: bold;', article, typeof article);

        return axios.post('/api/v1/articles/draggable/add/', article)
            .then(res => {
                console.log('%cres from postArticle', 'color: darkseagreen; font-weight: bold;', res);
                return res.status;
            })
            .catch(err => {
                if (err.response) return err.response
                console.log('%cerr from postArticle', 'color: red; font-weight: bold;', err);
            });
    },

    postImage({ commit }, data) {
        const formData = new FormData();
        formData.append('file', data.file);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: ( progressEvent ) => {
                // Derive percentage (number) between 0 - 100 from progressEvent loading related properties
                const uploadProgress = parseInt(Math.round(( progressEvent.loaded / progressEvent.total ) * 100 ));

                // Update progress bar style with updated uploadProgress number
                // 3.6 needed because of circular progress (360°)
                data.imageProgressBar.style.background = `conic-gradient(hsla(0, 0%, 100%, .8) ${uploadProgress * 3.6}deg, hsla(0, 0%, 100%, .4) ${uploadProgress * 3.6}deg)`;

                // If upload finished unblur img + hide progress bar
                if (progressEvent.loaded === progressEvent.total) {
                    data.imagePreview.style.filter = 'blur(0)';
                    data.imageProgressBar.style.background = '';
                }
            },
        };

        return axios.post('/api/v1/articles/pre_add_image/', formData, config)
            .then(res => {
                return res;
            })
            .catch(err => {
                console.log('%cerr in postImage', 'color: darkseagreen; font-weight: bold;', err, err.response);
            });
    },

    updateArticle({ commit }, data) {
        console.log('%cupdateArticle article + type', 'color: orange; font-weight: bold;', data.article, typeof data.article);

        return axios.put(`/api/v1/articles/draggable/${data.slug}/`, data.article)
            .then(res => {
                console.log('%cres in updateArticle', 'color: orange; font-weight: bold;', res);
                return res.status;
            })
            .catch(err => {
                console.log('%cerr in updateArticle', 'color: red; font-weight: bold;', err);
                if (err.response) return err.response;
            });
    },

    validateArticle({ commit }, data) {
        let articleValidationErrors = [];
        let headingExists = false;
        let summaryExists = false;

        data.article.forEach(element => {
            if (!element.key) articleValidationErrors.push({ message: `Please choose a section type or delete the section.` });

            // Only image section is allowed to have an empty value field
            if (element.key !== 'image' && !element.value) articleValidationErrors.push({ message: `Please enter content for the section ${element.key} or delete the section.` });

            if (element.key === 'heading') headingExists = true;

            if (element.key === 'summary') summaryExists = true;

            if (element.key === 'table') {
                if (!element.shape) articleValidationErrors.push({ message: 'Please enter a shape for the table.' });
                const shapeArray = element.shape.split(',');
                // Check shape for containing only two integer vals
                if (shapeArray.length > 2) articleValidationErrors.push({ message: 'The table shape cannot contain more than two comma separated integers.' });

                if (!element.table_head) articleValidationErrors.push({ message: 'Please enter column names (table heads).' });

                const numberOfColumnsTableHead = parseInt(element.table_head.split(',').length);
                const shapeRows = parseInt(shapeArray[0]);
                const shapeColumns = parseInt(shapeArray[1]);

                // Check if columns match in head & shape
                if (numberOfColumnsTableHead !== shapeColumns) articleValidationErrors.push({ message: `Number of columns under Head (${numberOfColumnsTableHead}) and under Shape (${shapeColumns}) must match.` });

                const numberOfTableContentCells = parseInt(element.value.split(',').length);
                // Check if rows * columns & # of comma separated vals in content match
                if (numberOfTableContentCells !== (shapeRows * shapeColumns)) articleValidationErrors.push({ message: `Number of cells (${numberOfTableContentCells}) and multiplied shape (${shapeRows} * ${shapeColumns} = ${(shapeRows * shapeColumns)}) do not match.` });
            }

            if (element.key === 'image') {
                // No image file has been uploaded
                if (!element.url) articleValidationErrors.push({ message: 'Please choose an image to upload or delete this section.' });

                // Since v-model ignores the initial value of a checkbox it needs to be set to false
                if(element.is_title_image === undefined) element.is_title_image = false;
            }
        });

        if (!headingExists) {
            articleValidationErrors.push({ message: 'Heading is a required section.' });
        }

        if (!summaryExists) {
            articleValidationErrors.push({ message: 'Summary is a required section.' });
        }

        commit('setArticleValidationErrors', articleValidationErrors);
        return articleValidationErrors.length;
    },

    validateImage({ commit }, file) {
        return file.type.includes('image');
    },
};

const mutations = {
    setDisabledPropOnArticleSections(state, columns) {
        const mappedArticleSections = columns.map(element => {
            return { name: element, disabled: false };
        });
        state.articleSections = mappedArticleSections;
    },

    setDisabledValueOnArticleSections(state, data) {
        if (data.sectionIndex >= 0) {
            state.articleSections[data.sectionIndex].disabled = data.isDisabled;
            return
        }
        state.articleSections.forEach(element => element.disabled = data.isDisabled);
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
    },

    setArticleValidationErrors(state, errors) {
        state.articleValidationErrors = errors;
    },

    setSingleArticleLoadStatus(state, status) {
        state.singleArticleLoadStatus = status;
    }
};

export default {
  state, getters, actions, mutations
}