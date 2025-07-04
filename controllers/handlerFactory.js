const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const slugify = require('slugify');
const APIFeatures = require('../utils/apiFeatures');

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = { ...req.body };
    if (data.name) {
      data.slug = slugify(data.name);
    }

    const doc = await Model.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No doc found with this ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const query = Model.findById(req.params.id);
    if (populateOptions) query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No doc found with this ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc
    });
  });

exports.getAll = (Model, modelName = '') =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.categoryId) filter = { category: req.params.categoryId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .search(modelName)
      .limitFields()
      .paginate();

    const filterQuery = features.query;

    const [docs, totalDocs] = await Promise.all([
      features.query,
      Model.countDocuments(filterQuery)
    ]);

    const totalPages = Math.ceil(totalDocs / features.pagination.limit);

    res.status(200).json({
      status: 'success',
      results: docs.length,
      pagination: {
        totalDocs,
        totalPages,
        currentPage: features.pagination.page
      },
      data: docs
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No doc found with this ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.createOne = (Model = {}) =>
  catchAsync(async (req, res, next) => {
    if (!req.body.category && req.params.categoryId) {
      req.body.category = req.params.categoryId;
    }

    const data = { ...req.body };

    const doc = await Model.create(data);

    res.status(201).json({
      status: 'success',
      data: doc
    });
  });
