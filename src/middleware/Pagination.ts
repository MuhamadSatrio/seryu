import { Request, Response, NextFunction } from 'express';

const pagination = (req: Request, res: Response, next: NextFunction) => {
    let { page_size, current } = req.query;

    const limitNum = parseInt(page_size as string, 10) || 10; // Default limit is 10
    const pageNum = parseInt(current as string, 10) || 1; // Default page is 1

    req.query.page_size = limitNum.toString();
    req.query.current = pageNum.toString();

    next();
};

export default pagination;
