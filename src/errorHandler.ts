/**
 * Модуль обработки ошибок
 */
import { Request, Response } from 'express';

export default function errorHandler(err: Error, req: Request, res: Response) {
  res.status(500).json({ error: err });
}
