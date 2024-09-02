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
    async exampleSearch() {
        return await this.prisma.recipe.findMany({
            take: 5,
            include: {
                creator: {
                    select: {
                        username: true
                    }
                }
            }
        })
    }
    async mixSearch(query: string) {
        // \b(?<!-|"|')\w+(?!"|')\b get included tags minus recipe names
        let searchRName = query.match(/(?<="|')[a-zA-Z0-9_ ]+(?="|')/g)
        // \b(?<!-|"|'|\()\w+(?!"|'|\))\b
        let includedTags = query.match(/\b(?<!-|"|'|\()\w+(?!"|'|\))\b/g)
        let excludedTags = query.match(/(?<=-)[a-zA-Z_]+/g)
        let usernameSearch = query.match(/(?<=\()[a-zA-Z0-9_ ]+(?=\))/g)
        // username search   (?<=\()[a-zA-Z0-9_ ]+(?=\))
        console.log("Username search: ", usernameSearch);
        console.log("recipe name search: ", searchRName);
        console.log("included tags: ", includedTags);
        console.log("excluded tags: ", excludedTags);


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
                            ...(usernameSearch != null && {
                                creator: {
                                    username: {
                                        in: usernameSearch,
                                        mode: "insensitive"
                                    }
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
                },
                include: {
                    creator: {
                        select: {
                            username: true
                        }
                    }
                }
            });
        console.log(res);

        return res
    }


}
