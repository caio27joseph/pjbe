import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Article } from './entities/article.entity';
import {
  CreateArticleInput,
  FindLibraryArticles,
  FindTableArticles,
  UpdateArticleInput,
} from './articles.inputs';
import { WhereInput } from 'src/graphql/dto/WhereOne.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-jwt.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => Article)
export class ArticlesResolver {
  constructor(
    @InjectRepository(Article)
    private readonly repo: Repository<Article>,
  ) {}

  @Mutation(() => Article)
  createArticle(@Args('input') input: CreateArticleInput) {
    const entity = this.repo.create(input);
    console.log(entity);
    return this.repo.save(entity);
  }

  @Query(() => [Article])
  libraryArticles(@Args('where') where: FindLibraryArticles) {
    return this.repo.find({
      where,
    });
  }

  @Query(() => [Article])
  tableArticles(@Args('where') where: FindTableArticles) {
    return this.repo.find({
      where: {
        library: {
          tableId: where.tableId,
        },
      },
    });
  }

  @Query(() => Article, { name: 'article' })
  findOne(@Args('where') where: WhereInput) {
    return this.repo.findOneBy(where);
  }

  @Mutation(() => Article)
  updateArticle(
    @Args('where') where: WhereInput,
    @Args('input') input: UpdateArticleInput,
  ) {
    return this.repo.update(where.id, input);
  }

  @Mutation(() => Article)
  removeArticle(@Args('where') where: WhereInput) {
    return this.repo.remove({
      id: where.id,
    } as Article);
  }
}
