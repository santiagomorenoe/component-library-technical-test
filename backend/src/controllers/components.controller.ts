import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { AuthRequest } from '../middleware/auth';

export async function track(req: Request, res: Response): Promise<void> {
  const event = await Event.create(req.body);
  res.status(201).json({ ok: true, id: event._id });
}

export async function getStats(req: Request, res: Response): Promise<void> {
  const { from, to, componentName, projectId } = req.query as Record<string, string | undefined>;

  const match: Record<string, unknown> = {};
  if (from || to) {
    const range: Record<string, Date> = {};
    if (from) range.$gte = new Date(from);
    if (to) range.$lte = new Date(to);
    match.timestamp = range;
  }
  if (componentName) match.componentName = componentName;
  if (projectId) match.projectId = projectId;

  const [summary, topComponents] = await Promise.all([
    Event.countDocuments(match),
    Event.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$componentName',
          total: { $sum: 1 },
          lastUsed: { $max: '$timestamp' },
          variants: { $push: '$variant' },
          actions: { $push: '$action' },
        },
      },
      {
        $project: {
          _id: 0,
          componentName: '$_id',
          total: 1,
          lastUsed: 1,
          variantBreakdown: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: '$variants' },
                as: 'v',
                in: {
                  k: '$$v',
                  v: {
                    $size: {
                      $filter: { input: '$variants', as: 'x', cond: { $eq: ['$$x', '$$v'] } },
                    },
                  },
                },
              },
            },
          },
          actionBreakdown: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: '$actions' },
                as: 'a',
                in: {
                  k: '$$a',
                  v: {
                    $size: {
                      $filter: { input: '$actions', as: 'x', cond: { $eq: ['$$x', '$$a'] } },
                    },
                  },
                },
              },
            },
          },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 50 },
    ]),
  ]);

  res.json({
    generatedAt: new Date().toISOString(),
    filters: { from, to, componentName, projectId },
    totalEvents: summary,
    topComponents,
  });
}

const CSV_HEADERS = ['componentName', 'variant', 'action', 'projectId', 'userId', 'timestamp', 'metadata'];

function escapeCell(value: unknown): string {
  const str = value == null ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value);
  // RFC 4180: wrap in quotes if the value contains comma, quote or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function exportJSON(req: AuthRequest, res: Response): Promise<void> {
  const { from, to, componentName, projectId } = req.query as Record<string, string | undefined>;

  const match: Record<string, unknown> = {};
  if (from || to) {
    const range: Record<string, Date> = {};
    if (from) range.$gte = new Date(from);
    if (to) range.$lte = new Date(to);
    match.timestamp = range;
  }
  if (componentName) match.componentName = componentName;
  if (projectId) match.projectId = projectId;

  // Stream cursor and collect docs — lean() gives plain objects
  const events: unknown[] = [];
  const cursor = Event.find(match).sort({ timestamp: -1 }).lean().cursor();
  for await (const doc of cursor) {
    events.push(doc);
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="component-tracking.json"');
  res.json({
    generatedAt: new Date().toISOString(),
    filters: { from, to, componentName, projectId },
    totalEvents: events.length,
    events,
  });
}

export async function exportCSV(req: AuthRequest, res: Response): Promise<void> {
  const { from, to, componentName, projectId } = req.query as Record<string, string | undefined>;

  const match: Record<string, unknown> = {};
  if (from || to) {
    const range: Record<string, Date> = {};
    if (from) range.$gte = new Date(from);
    if (to) range.$lte = new Date(to);
    match.timestamp = range;
  }
  if (componentName) match.componentName = componentName;
  if (projectId) match.projectId = projectId;

  const cursor = Event.find(match).sort({ timestamp: -1 }).lean().cursor();

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="component-tracking.csv"');

  res.write(CSV_HEADERS.join(',') + '\r\n');

  for await (const doc of cursor) {
    const row = CSV_HEADERS.map((h) => escapeCell((doc as Record<string, unknown>)[h]));
    res.write(row.join(',') + '\r\n');
  }

  res.end();
}
