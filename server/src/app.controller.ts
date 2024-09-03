import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { RecipeService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express'
import { Recipe } from '@prisma/client';
import { SearchService } from './search.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';


@Controller()
export class RecipeController {
  constructor(private readonly recipeService: RecipeService, private readonly searchService: SearchService, private readonly authService: AuthService) { }

  @Get('/api/recipe/:id')
  getRecipe(@Param('id') id: string): Promise<Recipe> {
    console.log("Getting Recipe #", id);

    return this.recipeService.getRecipe(id);
  }

  @Get('/api/search/:query')
  searchRecipes(@Param('query') query: string): Promise<Recipe[]> {
    console.log("Searching for recipe with query: ", query);


    return this.searchService.mixSearch(query)
  }

  @Post('/api/register')
  registerUser(@Body() body) {
    const { email, username, password } = body
    console.log("Registering a new user");

    console.log(body);

    let userCred = this.authService.registerNormal(email.trim(), username, password)

    return userCred
  }


  @Post('/api/register/oauth')
  registerOAuth(@Body() body) {
    const { email, uid } = body
    console.log("OAUTH Registering: ", email, uid);

    let userCred = this.authService.registerOAuth(email, uid)
    return userCred
  }

  @Post('/api/user/update')
  @UseGuards(AuthGuard)
  setUsername(@Body() body) {
    const { username, uid } = body
    console.log("Updating Username");
    console.log("Desired Username: ", username);


    let userCred = this.authService.updateUsername(username, uid)

    return userCred
  }


  @Get('/api/examples')
  getExamples() {
    console.log("Fetching examples");
    

    return this.searchService.exampleSearch()
  }


  @Post('/api/create')
  @UseInterceptors(FileInterceptor('file'))
  postRecipe(@Body() body, @UploadedFile(
    new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: 30 * 1024 ** 2 }), new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })]
    })
  ) file: Express.Multer.File): Promise<Recipe> {
    // Check if img meets specs, and if user is logged in.
    console.log("Submitting New Recipe");
    console.log(body);
    console.log(file);


    return this.recipeService.postRecipe(body, file);
  }


  @Put('/api/update')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  updateRecipe(@Body() body, @UploadedFile(
    new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: 30 * 1024 ** 2 }), new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      fileIsRequired: false
    })
  ) file: Express.Multer.File) {
    // Check if img meets specs, and if user is logged in.
    console.log("updating recipe");
    console.log(body);
    console.log(file);

    body.id = parseInt(body.id)

    return this.recipeService.updateRecipe(body, file);

  }


  @Delete('/api/recipe')
  @UseGuards(AuthGuard)
  deleteRecipe(@Body() body): Promise<void> {
    console.log("Deleting recipe");

    console.log(body);

    return this.recipeService.deleteRecipe(body);

  }


  @Delete('/api/user')
  @UseGuards(AuthGuard)
  deleteUser(@Body() body): Promise<void> {
    console.log("Deleting User");

    console.log(body);

    return this.authService.deleteUser(body);

  }

}




