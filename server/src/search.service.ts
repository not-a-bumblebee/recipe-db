import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SearchService {
    constructor(private prisma: PrismaService, private readonly configService: ConfigService) { }

    async nameSearch(recipe_name: string) {
        let res = await this.prisma.recipe.findMany(
            {
                where: { recipe_name: { contains: recipe_name, mode: "insensitive" } }
            });
        console.log(res);

        return res
    }
    async tagSearch(query: string) {
        // (?<=-)[a-zA-Z_]+    get exclusion tags
        // \b(?<!-)\w+\b   get normal tags
        let includedTags = query.match(/\b(?<!-)\w+\b/g)
        let excludedTags = query.match(/(?<=-)[a-zA-Z_]+/g)

        console.log(includedTags);
        console.log(excludedTags);
        let res = await this.prisma.recipe.findMany(
            {
                where: {
                    AND: [
                        {
                            recipeTag: {
                                some: {
                                    tag: {
                                        tag_name: {
                                            in: includedTags,
                                            mode: "insensitive",
                                        }
                                    }
                                }
                            }
                        },
                        {
                            ...(excludedTags != null && {
                                recipeTag: {
                                    none: {
                                        tag: {
                                            tag_name: {
                                                in: excludedTags,
                                                mode: "insensitive",
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    ]
                }
            });
        console.log(res);

        return res
    }
    async mixSearch(query: string) {
        // \b(?<!-|"|')\w+(?!"|')\b get included tags minus recipe names
        let searchRName = query.match(/(?<="|')[a-zA-Z0-9_ ]+(?="|')/g)
        let includedTags = query.match(/\b(?<!-|"|')\w+(?!"|')\b/g)
        let excludedTags = query.match(/(?<=-)[a-zA-Z_]+/g)



        let res = await this.prisma.recipe.findMany(
            {
                where: {
                    AND: [
                        {
                            ...(searchRName != null && {
                                recipe_name: {
                                    contains: searchRName[0],
                                    mode: "insensitive"
                                }
                            })
                        },
                        {
                            ...(includedTags != null && {
                                recipeTag: {
                                    some: {
                                        tag: {
                                            tag_name: {
                                                in: includedTags,
                                                mode: "insensitive",
                                            }
                                        }
                                    }
                                }
                            })

                        },
                        {
                            ...(excludedTags != null && {
                                recipeTag: {
                                    none: {
                                        tag: {
                                            tag_name: {
                                                in: excludedTags,
                                                mode: "insensitive",
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    ]
                }
            });
        return res
    }


}
