export default function(schema) {
  return async function(req, res, next) {
    try {
      await schema.validate(req.body, { abortEarly: false });

      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };
}
