import axios from 'axios';

const state = {
    // articleColumns: null,
    articleColumns: ['heading', 'summary', 'paragraph', 'subheading', 'listarray'],
};

const getters = {
    articleColumns: state => {
        // const withDisabledProp = state.articleColumns.map()
        const mappedArticleColumns = state.articleColumns.map(element => {
            return { name: element, disabled: false };
        });

        console.log('%cmappedArticleColumns', 'color: darkseagreen; font-weight: bold;', mappedArticleColumns);
        return mappedArticleColumns;
    }
};

const actions = {
    getArticleColumns({ commit }) {
        axios.get('http://127.0.0.1:8000/bookmarks/get_article_columns/')
        .then(res => {
            console.log('res', res.data.columns);
            // console.log('reheadingExistss',this.headingExists);

            // if (this.headingExists > 1) {
            //     this.articleColumns = res.data.columns.filter(item => item !== 'heading');
            //     console.log('%cthis.articleColumns', 'color: darkseagreen; font-weight: bold;', this.articleColumns);
            //     return
            // }

            commit('setArticleColumns', res.data.columns);
        })
        .catch(err => {
            console.log('err', err);
        });
    },

    getArticles({ commit }) {
        axios.get('http://127.0.0.1:8000/bookmarks/articles/')
        .then(res => {
            console.log('res', res.data);
            // console.log('reheadingExistss',this.headingExists);

            // if (this.headingExists > 1) {
            //     this.articleColumns = res.data.columns.filter(item => item !== 'heading');
            //     console.log('%cthis.articleColumns', 'color: darkseagreen; font-weight: bold;', this.articleColumns);
            //     return
            // }

            // commit('setArticleColumns', res.data.columns);
        })
        .catch(err => {
            console.log('err', err);
        });
    },
};

const mutations = {
    setArticleColumns(state, columns) {
        state.articleColumns = columns;
    }
};

export default {
  state, getters, actions, mutations
}