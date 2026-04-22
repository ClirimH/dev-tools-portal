import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bcrypt from 'bcrypt';
import { join } from 'path';
import { UsersService } from './users/users.service';

async function seedAdmin(app: NestExpressApplication) {
  const usersService = app.get(UsersService);
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail) {
    throw new Error('Missing required environment variable: ADMIN_EMAIL');
  }

  if (!adminPassword) {
    throw new Error('Missing required environment variable: ADMIN_PASSWORD');
  }

  const existing = await usersService.findByEmail(adminEmail);

  if (!existing) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await usersService.create({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin user created');
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await seedAdmin(app);

  const portValue = process.env.PORT;

  if (!portValue) {
    throw new Error('Missing required environment variable: PORT');
  }

  const port = Number(portValue);

  if (Number.isNaN(port)) {
    throw new Error('PORT must be a valid number');
  }

  await app.listen(port);
  console.log(`Application running on: ${await app.getUrl()}`);
}
void bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
