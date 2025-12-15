import { Post } from './post.ts';
import { Category } from './category.ts';
import { Pagination } from './pagination.ts';

export interface InitialDataStructure {
    categories?: Category[];
    post?: Post | null;
    posts_headline?: { data: Post[]; pagination: Pagination };
    posts_top?: { data: Post[]; pagination: Pagination };
    posts_regular?: { data: Post[]; pagination: Pagination };
    posts_search?: { data: Post[]; pagination: Pagination };
    postError?: number | null;
    posts_headlineError?: number | null;
    posts_topError?: number | null;
    posts_regularError?: number | null;
    posts_searchError?: number | null;
    generalError?: boolean;
}
