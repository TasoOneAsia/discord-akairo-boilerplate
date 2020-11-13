import { model, Schema } from 'mongoose';

export default model(
  'User',
  new Schema({
    id: { type: String },
    registered: { type: Number, default: Date.now() },
  })
);
