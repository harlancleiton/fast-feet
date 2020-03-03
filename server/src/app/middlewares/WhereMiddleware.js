export default function(...args) {
  return function(req, res, next) {
    if (Object.keys(req.query).length) {
      const where = Object.assign(
        ...Object.keys(req.query)
          .filter(key => args.map(arg => arg.name).includes(key))
          .map(key => {
            const { op } = args.find(arg => arg.name === key);

            return {
              [key]: { [op]: `%${req.query[key]}%` },
            };
          })
      );

      req.where = where;
    }

    return next();
  };
}
