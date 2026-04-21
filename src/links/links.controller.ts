import { Controller, Get } from '@nestjs/common';
import { LinksService } from './links.service';

@Controller('api/links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get()
  findAllPublic() {
    return this.linksService.findAllPublic();
  }
}