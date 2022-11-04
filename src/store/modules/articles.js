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

            // Array containing the article processed in a way to be displayed for the user
            const articleForDisplay = [];
            // Array containing the article processed in a way to used in the ArticleForm component (for form elements)
            // While mapping though the order (to KEEP that order) both arrays will be filled
            
            const articleForForm = order.map(element => {

                // Get index of object in article array where key's value is 'element' (element being 'heading', 'summary' etc)
                const i = article.findIndex(section => {
                    return section.key === `${element}`;
                });

                // Handle listarrays
                if (element === 'listarray') {
                    const section = article[i];
                    // Create id for section
                    section.id = Math.floor(Date.now() * Math.random());

                    // Preserve article[i] for articleForForm (if not 'value' will be mutated as for articleForDisplay)
                    const listarray = JSON.parse(JSON.stringify(article[i]));
                    // Save Listarray item (string) in array
                    listarray.items = listarray.items.map(({value}) => value);
                    articleForDisplay.push(listarray);

                    // Current article section needs to be deleted from article
                    // If not, findIndex will return index of that (first) section again and not ne one of the next ones (e.g in case of multiple listarrays, paragraphs, tables)
                    article.splice(i, 1);
                    return section;
                }

                // Handle tables
                if (element === 'table') {
                    const section = article[i];
                    // Create id for section
                    section.id = Math.floor(Date.now() * Math.random());
                    // Create array of objects from cols ({name: 'columnName'}) in order to display it correctly in the form again
                    section.columns = section.cols.map(columnName => {
                        const column = {};
                        column.name = columnName;
                        return column;
                    });
                    
                    // Preserve article[i] for articleForForm (if not 'value' will be mutated as for articleForDisplay)
                    const table = JSON.parse(JSON.stringify(article[i]));
                    
                    // Since cols is aalready an array of string (of column names) just assign it to the table_head prop
                    table.table_head = table.cols;
                    // Create empty rows array to store arrays of table content strings (cells)
                    const rows = [];
                    // Loop through table.rows
                    for (const item of table.rows) {
                        
                        const row = [];
                        // Loop through row objects + push prop item to row array
                        for (const cell in item) {
                            row.push(item[cell]);
                        }

                        rows.push(row);
                    }
                    table.rows = rows;
                    articleForDisplay.push(table);

                    // Current article section needs to be deleted from article
                    // If not, findIndex will return index of that (first) section again and not ne one of the next ones (e.g in case of multiple listarrays, paragraphs, tables)
                    article.splice(i, 1);
                    return section;
                }

                const section = article[i];
                // Create id for section
                section.id = Math.floor(Date.now() * Math.random());
                // If nothing needs to be procees for the article displayed to the user, just push it to the array
                articleForDisplay.push(article[i]);
                // Current article section needs to be deleted from article
                // If not, findIndex will return index of that (first) section again and not ne one of the next ones (e.g in case of multiple listarrays, paragraphs, tables)
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
                data.imagePreview.style.filter = 'blur(5px)';

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
        return axios.put(`/api/v1/articles/draggable/${data.slug}/`, data.article)
            .then(res => {
                return res.status;
            })
            .catch(err => {
                console.log('%cerr in updateArticle', 'color: red; font-weight: bold;', err);
                if (err.response) return err.response;
            });
    },

    validateArticle({ commit }, data) {
        console.log('%carticle in validate', 'color: darkseagreen; font-weight: bold;', data.article);
        let articleValidationErrors = [];
        let headingExists = false;
        let summaryExists = false;

        data.article.forEach(element => {
            switch (element.key) {
                case '':
                    articleValidationErrors.push({ message: `Please choose a section type or delete the section.` });
                    break;

                case 'heading':
                    if (!element.value) {
                        if (!element.errors) element.errors = {};
                        element.errors.value = `Please enter content for the ${element.key}. It is required in order to create an article.`;
                    } else if (element.value) {
                        if (element.key === 'heading') headingExists = true;
                        // TODO Here delete errors?
                    }
                    break;

                case 'summary':
                    if (!element.value) {
                        if (!element.errors) element.errors = {};
                        element.errors.value = `Please enter content for the ${element.key}. It is required in order to create an article.`;
                    } else if (element.value) {
                        if (element.key === 'summary') summaryExists = true;
                        // TODO Here delete errors?
                    }
                    break;

                case 'image':
                    // No image file has been uploaded
                    if (!element.url) {
                        if (!element.errors) element.errors = {};
                        element.errors.missingImage = `Please choose an image to upload or delete this section.`;
                    }

                    // Since v-model ignores the initial value of a checkbox it needs to be set to false
                    if(element.is_title_image === undefined) element.is_title_image = false;

                    if (element.value === '') delete element.value;
                    break;

                case 'listarray':
                    // Items array not set or empty
                    if (!element.items || element.items.length === 0) {
                        if (!element.errors) element.errors = {};
                        element.errors.missingItems = `Please add items to this ${element.key} or delete the section.`
                    }

                    // Check for empty list items
                    if (element.items) {
                        element.items.forEach(item => {
                            if (!item.value) {
                                item.errors = {};
                                item.errors.missingItemContent = `Please enter content for this item or delete it.`
                            }
                        });
                    }

                    if (element.value === '') delete element.value;
                    // delete errors? TODO
                    break;
                
                case 'table':
                    // Check if a column's name property is empty
                    element.columns.forEach(column => {
                        // Double check for empty string (should already be check @blur event of column name input)
                        if (column.name === '') {
                            column.errors = {};
                            column.errors.missingColumnName = `A column name is required. Please enter one or delete the column.`;
                        }

                        // Check if column name exceeds max-length
                        if (column.name.length > 30) {
                            column.errors = {};
                            column.errors.maxLengthExceeded = `Please enter a column name with 30 characters or less.`;
                        }
                    });

                    if (element.value === '') delete element.value;

                    // NOTE: The user should have the opportunity to leave a cell empty. Hence, no check
                    break;
                    
                default:
                    // Sections: paragraph
                    if (!element.value) {
                        if (!element.errors) element.errors = {};
                        element.errors.value = `Please enter content for this ${element.key} or delete the section.`;
                    }
                    // else if delete errors? TODO
                    break;
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