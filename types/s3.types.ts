export interface AddPhotoRequest {
  userId: number;
  id: number;
  photoUrl: string;
}

export interface DeleteRecipePhotoRequest {
  recipeId: number;
  userId: number;
}
