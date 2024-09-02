import { Module } from '@nestjs/common';
import { RecipeController } from './app.controller';
import { RecipeService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma.service';
import { SearchService } from './search.service';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ThrottlerModule.forRoot([{
    ttl: 60000,
    limit: 30,
  }])],
  controllers: [RecipeController],
  providers: [RecipeService, PrismaService, SearchService, AuthService, FirebaseService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }
  ],
})
export class AppModule { }
