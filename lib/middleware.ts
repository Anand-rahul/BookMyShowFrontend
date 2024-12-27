import { NextRequest, NextResponse } from 'next/server';

export function runMiddleware(
  req: NextRequest,
  res: NextResponse,
  fn: (...args: any[]) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    fn(req as any, res as any, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

