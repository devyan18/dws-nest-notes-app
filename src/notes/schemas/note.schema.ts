import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema()
export class Note {
  @Prop()
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: string;

  @Prop()
  sort: number;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
