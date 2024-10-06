import FavoritesService from "@/api/services/favorites.service";
import { GetIsInFavoritesRequest } from "@/types/favorites";
import { useQuery } from "@tanstack/react-query";

export const useIsFavorite = (params: GetIsInFavoritesRequest, enabled: boolean) => {
  return useQuery({
    queryKey: ["is-in-favorites"],
    queryFn: async () => await FavoritesService.getIsInFavorites(params),
    enabled: !!enabled,
  });
};
