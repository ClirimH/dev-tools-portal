import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Link, LinkDocument } from './link.schema';
import { CreateLinkRequestDto } from 'src/dto';

@Injectable()
export class LinksService {
  constructor(
    @InjectModel(Link.name) private readonly linkModel: Model<LinkDocument>,
  ) {}

  create(dto: CreateLinkRequestDto) {
    return this.linkModel.create(dto);
  }

  findAllPublic() {
    return this.linkModel
      .find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });
  }

  findAllAdmin() {
    return this.linkModel.find().sort({ order: 1, createdAt: -1 });
  }

  async findOne(id: string) {
    const link = await this.linkModel.findById(id);
    if (!link) throw new NotFoundException('Link not found');
    return link;
  }

  async update(id: string, dto: CreateLinkRequestDto) {
    const link = await this.linkModel.findByIdAndUpdate(id, dto, { new: true });
    if (!link) throw new NotFoundException('Link not found');
    return link;
  }

  async remove(id: string) {
    const link = await this.linkModel.findByIdAndDelete(id);
    if (!link) throw new NotFoundException('Link not found');
    return { message: 'Link deleted successfully' };
  }
}
