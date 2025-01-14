import { GetRecipesRequest } from "./recipe.types";

export interface QueryKeyType {
  pageParam: {
    page: number;
  };
  queryKey: [a: string, b: GetRecipesRequest];
}
