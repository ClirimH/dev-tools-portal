import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users/users.service';

async function seedAdmin(app) {
  const usersService = app.get(UsersService);
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const existing = await usersService.findByEmail(adminEmail);

  if (!existing) {
    const hashedPassword = await bcrypt.hash(adminPassword || 'root1234', 10);

    await usersService.create({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin user created');
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await seedAdmin(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
