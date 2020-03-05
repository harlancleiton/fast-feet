export default function(...args) {
  return function(req, res, next) {
    if (Object.keys(req.query).length) {
      const keysFiltered = Object.keys(req.query).filter(key =>
        args.map(arg => arg.name).includes(key)
      );

      if (keysFiltered.length) {
        const where = Object.assign(
          ...keysFiltered.map(key => {
            const { op, transform } = args.find(arg => arg.name === key);

            if (transform)
              return {
                [key]: { [op]: transform(req.query[key]) },
              };

            return {
              [key]: { [op]: req.query[key] },
            };
          })
        );

        req.where = where;
      }
    }

    return next();
  };
}

export function transformLikeable(value) {
  return `%${value}%`;
}
