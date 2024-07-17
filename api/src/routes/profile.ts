import { Router, Request, Response } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import db from '../libs/db';

const router = Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.json({ profile: null });
    return;
  }

  const profile = await db.findOne({ _id: id });

  res.json({ profile });
});

router.post(
  '/',
  checkSchema({
    name: { isEmpty: false },
    email: { isEmail: true, isEmpty: false },
    phone: { isMobilePhone: true, isEmpty: false },
  }),
  async (req: Request, res: Response) => {
    const { name, email, phone } = req.body;
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(400).json({ error: '参数错误' });
      return;
    }

    try {
      const profileExist = await db.findOne({ email });
      if (profileExist) {
        res.status(400).json({ error: 'Email already exists' });
        return;
      }

      const profile = await db.insert({ name, email, phone });
      res.json({ profile: { id: profile._id } });
    } catch (error) {
      res.status(400).json({ error: error.message || 'Invalid request' });
    }
  },
);

router.put(
  '/:id',
  checkSchema({
    id: { isEmpty: false },
    name: { isEmpty: false },
    email: { isEmail: true, isEmpty: false },
    phone: { isMobilePhone: true, isEmpty: false },
  }),
  async (req: Request, res: Response) => {
    const { name, email, phone } = req.body;
    const { id } = req.params;

    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json({ error: '参数错误' });
      return;
    }

    try {
      const profile = await await db.findOne({ email });
      if (profile && profile._id !== id) {
        res.status(400).json({ error: 'Email already exists' });
        return;
      }

      await db.update({ _id: id }, { name, email, phone });
      res.json({ profile: { id } });
    } catch (error) {
      res.status(400).json({ error: error.message || 'Invalid request' });
    }
  },
);

export default router;
