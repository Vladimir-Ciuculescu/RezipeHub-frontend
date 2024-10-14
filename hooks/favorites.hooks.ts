import FavoritesService from "@/api/services/favorites.service";
import { GetFavoritesRequest, GetIsInFavoritesRequest } from "@/types/favorites";
import { useQuery } from "@tanstack/react-query";

export const useFavorites = (params: GetFavoritesRequest) => {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: () => FavoritesService.getFavorties(params),
  });
};

export const useIsFavorite = (params: GetIsInFavoritesRequest, enabled: boolean) => {
  return useQuery({
    queryKey: ["is-in-favorites"],
    queryFn: async () => await FavoritesService.getIsInFavorites(params),
    enabled: !!enabled,
  });
};
