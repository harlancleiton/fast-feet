export default function(req, res, next) {
  if (req.method === 'GET') {
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    req.pagination = { offset, limit };
  }

  return next();
}
