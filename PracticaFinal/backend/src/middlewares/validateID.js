export const validateId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'El id debe ser un número entero positivo' });
  }
  req.params.id = id;
  next();
};