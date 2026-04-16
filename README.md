[page link](https://d331ewo1lx7uep.cloudfront.net/)

Recipe-DB is a remix single page application with a Nest JS backend where you can:
  - Create recipes
  - Search with special tags like:
    - Ingredient Name : brown_sugar
    - Recipe Name : "apple pie"
    - Creator Name : (Tom)
    - Sample query : (Tom) "apple pie" brown_sugar         //An apple pie made by Tom that has brown sugar.
  - Login using OAuth

Features:
  - Image uploads to AWS S3
  - Backend deployed using Lambda for serverless
  - User authentication by Firebase
  - Zustand for global state management
  - Search engine built using Prisma and Postgresql with RDS 
