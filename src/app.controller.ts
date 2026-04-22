import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  getLandingPage() {
    return { title: 'Developer Tools' };
  }

  @Get('admin')
  @Render('login')
  getAdminLoginPage() {
    return { title: 'Admin Login' };
  }

  @Get('admin/panel')
  @Render('admin')
  getAdminPage() {
    return { title: 'Admin Panel' };
  }
}