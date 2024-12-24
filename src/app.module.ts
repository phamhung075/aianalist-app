import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './modules/contact/contact.module';
import { PythonModule } from './lib/python/python.module';

@Module({
  imports: [ContactModule, PythonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
