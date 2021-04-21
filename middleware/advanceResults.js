const advancedResults = (model, populate) => async (req, res, next) => {
 // Copy req.query
  // i.e /api/v1/bootcamps?select=name,description,housing&sort=name
  const reqQuery = { ...req.query };

  // Fields to exclude, dont want to match as a field
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  // { select: 'name,description,housing', sort: 'name' }
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Manipulate query string and add operator
  // BEFORE { averageCost: { gte: '1000' }, 'location.city': 'Boston' }
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // AFTER { averageCost: { $gte: '1000' }, 'location.city': 'Boston' }

  // Finding resource
  query = model.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields); // get only the fields from query parameters i.e name, description
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy); // sort by specific parameter
  } else {
    //default value createdAt
    query = query.sort('-createdAt');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if(populate){
    query = query.populate(populate);
  }

  // Execute query
  const results = await query;

  //Pagination result
  const pagination = {};

  // if we dont have a previous page then we dont want to show
  // if we dont have a next page we dont want to show that
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit: limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };

  next();
  };
  
  module.exports = advancedResults;