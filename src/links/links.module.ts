import { Module } from '@nestjs/common';
import { AdminLinksController } from './admin-links.controller';
import { LinksService } from './links.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Link, LinkSchema } from './link.schema';
import { LinksController } from './links.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Link.name, schema: LinkSchema }]),
  ],
  controllers: [AdminLinksController, LinksController],
  providers: [LinksService],
})
export class LinksModule {}
