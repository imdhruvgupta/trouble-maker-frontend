import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  queryParams: ['page', 'limit'],
  page: 1,
  limit: 2,
  searchString: '',
  searchTask: task(function * () {
    yield timeout(250)

    let searchStr = this.get('searchString').trim()
    let pageOpts = {}

    if(searchStr === '') {
      pageOpts = {
        limit: this.get('limit')
      }
    }
    const questions = yield this.get('store').query('question', {
      include: 'user',
      page: pageOpts,
      filter: {
        title: {
          $iLike: `%${this.get('searchString')}%`
        }
      }
    })
    this.set('page', 1)
    this.set('questions', questions)
  }).restartable(),
  actions : {
    deleteQuestion(question) {
      question.destroyRecord()
    }
  }
});
