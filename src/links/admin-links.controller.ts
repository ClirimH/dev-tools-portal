import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { JwtAuthGuard } from 'src/auth/jwt-guard';
import { CreateLinkRequestDto } from 'src/dto';

@UseGuards(JwtAuthGuard)
@Controller('api/admin/links')
export class AdminLinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  create(@Body() dto: CreateLinkRequestDto) {
    return this.linksService.create(dto);
  }

  @Get()
  findAllAdmin() {
    return this.linksService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.linksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: CreateLinkRequestDto) {
    return this.linksService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.linksService.remove(id);
  }
}
