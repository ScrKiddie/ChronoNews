import { Post } from './post.ts';
import { Category } from './category.ts';
import { Pagination } from './pagination.ts';

export interface InitialDataStructure {
    categories?: Category[];
    post?: Post;
    posts_headline?: { data: Post[]; pagination: Pagination };
    posts_top?: { data: Post[]; pagination: Pagination };
    posts_regular?: { data: Post[]; pagination: Pagination };
    posts_search?: { data: Post[]; pagination: Pagination };
    postError?: boolean;
    posts_headlineError?: boolean;
    posts_topError?: boolean;
    posts_regularError?: boolean;
    posts_searchError?: boolean;
    generalError?: boolean;
}
