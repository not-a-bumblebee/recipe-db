import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RecipeService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express'
import { Recipe } from '@prisma/client';
import { SearchService } from './search.service';


@Controller()
export class RecipeController {
  constructor(private readonly recipeService: RecipeService, private readonly searchService: SearchService) { }

  @Get('/recipe/:id')
  getRecipe(@Param('id') id: string): Promise<Recipe> {
    return this.recipeService.getRecipe(id);
  }

  @Get('/search/:mode/:query')
  searchRecipes(@Param('mode') mode: string, @Param('query') query: string): Promise<Recipe[]> {
    console.log("Searching");

    console.log(query);
    console.log(mode);

    // let mode = 'idk'

    if (mode == 'Name')
      return this.searchService.nameSearch(query)
    else if (mode == 'Ingredient')
      return this.searchService.tagSearch(query)
    else
      return this.searchService.mixSearch(query)

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

    // Temp, remove later
    body.user_id = 1

    // console.log(typeof body.files[0]);





    return this.recipeService.postRecipe(body, file);
  }

  // body should also contain some user token.
  @Put('/update')
  @UseInterceptors(FileInterceptor('file'))
  updateRecipe(@Body() body, @UploadedFile(
    new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: 30 * 1024 ** 2 }), new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' })],
      fileIsRequired:false
    })
  ) file: Express.Multer.File)  {
    // Check if img meets specs, and if user is logged in.
    console.log("updating");
    console.log(body);
    console.log(file);

    // Temp, remove later
    body.user_id = 1
    body.id = parseInt(body.id)

    // console.log(typeof body.files[0]);




    // Promise<Recipe>
    return this.recipeService.updateRecipe(body, file);
    // return "bonojour"
  }

  @Delete()
  deleteRecipe(@Body() body): Promise<Recipe> {
    // Check if img meets specs, and if user is logged in.


    // Temp, remove later
    body.user_id = 1

    // console.log(typeof body.files[0]);





    // return this.recipeService.deleteRecipe(body);
    return
  }

}




