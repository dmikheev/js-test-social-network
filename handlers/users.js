var User = require('./../models/user');

var PAGE_RESULTS_COUNT = 10;

function find(req, res, next) {
  var searchString = req.params.search_query || '';
  var pageNum = req.params.page || 0;
  var query;

  if (searchString) {
    query = User
      .find(
        { $text: { $search: searchString } },
        {
          name: true,
          lastname: true,
          score: { $meta: 'textScore' }
        }
      )
      .sort({ score: { $meta: 'textScore' } });
  } else {
    query = User.find({}, 'name lastname');
  }
  
  query
    .skip(pageNum * PAGE_RESULTS_COUNT)
    .limit(PAGE_RESULTS_COUNT)
    .exec(function(err, users) {
      return err ? next(err) : res.json(users);
    });
}

module.exports = {
  find: find
};