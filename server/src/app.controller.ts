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

  @Get('/recipe/:id')
  getRecipe(@Param('id') id: string): Promise<Recipe> {
    return this.recipeService.getRecipe(id);
  }

  // @Get('/search/:mode/:query')
  @Get('/search/:query')
  searchRecipes(@Param('query') query: string): Promise<Recipe[]> {
    console.log("Searching");

    console.log(query);
    // console.log(mode);



    return this.searchService.mixSearch(query)
  }

  @Post('/register')
  registerUser(@Body() body) {
    const { email, username, password } = body
    console.log(body);

    let userCred = this.authService.registerNormal(email.trim(), username, password)


    return userCred
  }
  @Post('/register/oauth')
  registerOAuth(@Body() body) {
    const { email, uid } = body
    console.log("OAUTH Registering: ", email, uid);

    let userCred = this.authService.registerOAuth(email, uid)
    return userCred

  }

  @Post('/user/update')
  @UseGuards(AuthGuard)
  setUsername(@Body() body) {
    const { username, uid } = body


    let userCred = this.authService.updateUsername(username, uid)


  }

  @Get('/examples')
  getExamples (){

    return this.searchService.exampleSearch()
  }

  @Post('/create')
  @UseInterceptors(FileInterceptor('file'))
  postRecipe(@Body() body, @UploadedFile(
    new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: 30 * 1024 ** 2 }), new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })]
    })
  ) file: Express.Multer.File): Promise<Recipe> {
    // Check if img meets specs, and if user is logged in.
    console.log("Posting");
    console.log(body);
    console.log(file);


    // console.log(typeof body.files[0]);





    return this.recipeService.postRecipe(body, file);
  }

  // body should also contain some user token.
  @Put('/update')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  updateRecipe(@Body() body, @UploadedFile(
    new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: 30 * 1024 ** 2 }), new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      fileIsRequired: false
    })
  ) file: Express.Multer.File) {
    // Check if img meets specs, and if user is logged in.
    console.log("updating");
    console.log(body);
    console.log(file);


    body.id = parseInt(body.id)

    // console.log(typeof body.files[0]);




    // Promise<Recipe>
    return this.recipeService.updateRecipe(body, file);
    // return "bonojour"
  }

  @Delete()
  @UseGuards(AuthGuard)
  deleteRecipe(@Body() body): Promise<Recipe> {
    // Check if img meets specs, and if user is logged in.



    // console.log(typeof body.files[0]);





    // return this.recipeService.deleteRecipe(body);
    return
  }

}




