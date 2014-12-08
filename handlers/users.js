var PAGE_RESULTS_COUNT = 10;

var User = require('./../models/user');

function find(req, res, next) {
  var searchString = req.params.search_query || '';
  var pageNum = req.params.page || 0;
  var query;

  if (searchString) {
    query = User
      .find(
        { $text: { $search: searchString } },
        {
          name: 'name',
          lastname: 'lastname',
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
      if (err)
        next(err);

      res.json(users);
    });
}

module.exports = {
  find: find
};