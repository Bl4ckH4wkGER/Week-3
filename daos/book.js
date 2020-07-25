const mongoose = require('mongoose');

const Book = require('../models/book');
const author = require('../models/author');

module.exports = {};

module.exports.getAll = (page, perPage, authorId) => {
  if (authorId) {
    return Book.aggregate([
      { $match: { authorId: authorId } },
    ]);
  } else {
    return Book.find().limit(perPage).skip(perPage*page).lean();
  }
}

module.exports.getById = (bookId) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return null;
  }
  return Book.findOne({ _id: bookId }).lean();
}

module.exports.deleteById = async (bookId) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return false;
  }
  await Book.deleteOne({ _id: bookId });
  return true;
}

module.exports.updateById = async (bookId, newObj) => {
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return false;
  }
  await Book.updateOne({ _id: bookId }, newObj);
  return true;
}

module.exports.create = async (bookData) => {
  try {
    const created = await Book.create(bookData);
    return created;
  } catch (e) {
    if (e.message.includes('validation failed') || e.message.includes('duplicate key error')) {
      throw new BadDataError(e.message);
    }
    throw e;
  }
}

module.exports.getBySearchTerm = async (query) => {
  return Book.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).lean();
}

// module.exports.getAuthorStats = async (authorInfo) => {
//   if (authorInfo == true) {
//     return Book.aggregate([
//       {},
//       {}
//     ])
//   } else {
//     return Book.aggregate([
//       {},
//       {}
//     ])
//   }
// }

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;