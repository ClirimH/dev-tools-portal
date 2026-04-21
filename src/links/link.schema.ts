import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LinkDocument = HydratedDocument<Link>;

@Schema({ timestamps: true })
export class Link {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  url: string;

  @Prop()
  icon?: string;

  @Prop()
  description?: string;

  @Prop()
  category?: string;

  @Prop()
  color?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;
}

export const LinkSchema = SchemaFactory.createForClass(Link);