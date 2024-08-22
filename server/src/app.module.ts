import { Module } from '@nestjs/common';
import { RecipeController } from './app.controller';
import { RecipeService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma.service';
import { SearchService } from './search.service';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [RecipeController],
  providers: [RecipeService, PrismaService, SearchService, AuthService, FirebaseService],
})
export class AppModule { }
