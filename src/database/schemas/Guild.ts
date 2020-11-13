import { model, Schema } from 'mongoose';
import { defaultPrefix } from '../../Config';

export default model(
  'Guild',
  new Schema({
    id: { type: String }, //ID of the guild
    registeredAt: { type: Number, default: Date.now() },
    prefix: { type: String, default: defaultPrefix },
  })
);
