import { Schema, model, Document } from 'mongoose';

export interface IEvent extends Document {
  componentName: string;
  variant: string;
  action: string;
  projectId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    componentName: { type: String, required: true, index: true },
    variant: { type: String, required: true, default: 'default' },
    action: { type: String, required: true, index: true },
    projectId: { type: String, index: true },
    userId: { type: String },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false, strict: false }
);

eventSchema.index({ componentName: 1, timestamp: -1 });
eventSchema.index({ componentName: 1, action: 1 });
eventSchema.index({ projectId: 1, timestamp: -1 });

export const Event = model<IEvent>('Event', eventSchema);
