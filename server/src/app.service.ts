import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid'
import { Recipe } from '@prisma/client';



@Injectable()
export class RecipeService {
  constructor(private prisma: PrismaService, private readonly configService: ConfigService) { }

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION')
  })
  private readonly CDN_URL = 'https://d1p9uf8cei0o4.cloudfront.net/';
  // deletes any tags that have no associated fields in the recipe_tags tables.
  async deleteStrayTags() {
    let res = await this.prisma.tag.deleteMany({
      where: {
        recipeTag: {
          none: {}
        }
      }
    })
    console.log("Deleting stray tags");
    console.log(res);
  }


  async deleteImage(image_url: string) {
    let key = image_url.replace(this.CDN_URL, '')

    let res = await this.s3Client.send(new DeleteObjectCommand({
      Bucket: this.configService.getOrThrow('BUCKET_NAME'),
      Key: key
    }))
    console.log("Deleted Image: ", res);

  }

  async getRecipe(id: string): Promise<Recipe> {
    return await this.prisma.recipe.findUniqueOrThrow({
      where: { id: parseInt(id) },
      include: {
        creator: {
          select: {
            username: true
          }
        }
      }
    });
  }

  async postRecipe(body, file): Promise<Recipe> {
    // Upload to s3, then add to db
    let keygen = file.originalname.replace(/^.*(?=.png|.jpg|.jpeg)/gm, uuidv4().replaceAll('-', ''))
    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.configService.getOrThrow('BUCKET_NAME'),
      Key: keygen,
      Body: file.buffer,
      ContentType: file.mimetype
    }))

    body.image_url = this.CDN_URL + keygen

    // TODO impl transaction here.

    // post recipe -> post tag  -> post recipe_tags
    let recipe = await this.prisma.recipe.create({
      data: {
        recipe_name: body.recipe_name,
        duration: body.duration,
        image_url: body.image_url,
        instructions: body.instructions,
        ingredients: JSON.stringify(body.ingredients),
        user_id: body.user_id,
        serving_size: body.serving_size,

      },

    })
    // [{name, quantity, key}]
    let map = await Promise.all(
      body.ingredients.map(async x => {
        let ingredientName = x.name.trim().replaceAll(' ', '_').toLowerCase()
        let tag = await this.prisma.tag.upsert({
          where: {
            tag_name: ingredientName
          },
          update: {
            recipeTag: {
              create: {
                recipe_id: recipe.id
              },
            }
          },
          create: {
            tag_name: ingredientName,
            recipeTag: {
              create: {
                recipe_id: recipe.id
              },
            }
          },
        })
      }))



    // if tags exists, get tag id, else create new tag.


    // add recipe tags


    return recipe
  }

  async updateRecipe(body, file = null): Promise<Recipe> {

    if (file) {
      let keygen = file.originalname.replace(/^.*(?=.png|.jpg|.jpeg)/gm, uuidv4().replaceAll('-', ''))
      console.log("replacing recipe image");

      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.configService.getOrThrow('BUCKET_NAME'),
        Key: keygen,
        Body: file.buffer,
        ContentType: file.mimetype
      }))

      this.deleteImage(body.image_url)
      body.image_url = this.CDN_URL + keygen
    }
    // replace image if new one is provided.
    // upsert the new ingredient_tags
    // delete any strays
    const { id, ...changes } = body

    let ingredientChanges = []

    if (changes?.ingredients) {

      changes.ingredients = JSON.stringify(changes.ingredients)

      ingredientChanges.push(
        // Deleting recipetags associated with the recipe so they can be replaced.
        this.prisma.recipeTags.deleteMany({
          where: {
            recipe_id: body.id,
          }
        }),
        // Replacing the recipetags that were deleted
        ...body.ingredients.map(x => {
          let ingredientName = x.name.trim().replaceAll(' ', '_').toLowerCase()
          return this.prisma.tag.upsert({
            where: {
              tag_name: ingredientName
            },
            update: {
              recipeTag: {
                create: {
                  recipe_id: id
                },
              }
            },
            create: {
              tag_name: ingredientName,
              recipeTag: {
                create: {
                  recipe_id: id
                },
              }
            },
          })
        })

      )
    }
    console.log("Changes:" + changes);
    console.log(typeof id);

    console.log(changes.ingredients ? ingredientChanges : null);


    const [updateRes, deleteRes, recipeTagRes] = await this.prisma.$transaction([
      // Update the recipe
      this.prisma.recipe.update({
        where: {
          id
        },
        data: changes
      }),

      ...(changes?.ingredients ? ingredientChanges : [])

    ])

    console.log(updateRes, deleteRes, recipeTagRes);


    this.deleteStrayTags()

    return updateRes
  }

  async deleteRecipe({ id, uid }): Promise<void> {


    let target = await this.prisma.recipe.delete({
      where: {
        id
      }
    })

    await this.deleteImage(target.image_url)

    await this.deleteStrayTags()

  }

}
