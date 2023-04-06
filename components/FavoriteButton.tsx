import axios from "axios";
import React, { useCallback, useMemo } from "react";
import { AiOutlinePlus, AiOutlineCheck } from "react-icons/ai";

import useCurrentUser from "@/hooks/useCurrentUser";
import useFavorites from "@/hooks/useFavorites";

interface FavoriteButtonProps {
  movieID: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieID }) => {
  const { mutate: mutateFavorites } = useFavorites();
  const { data: currentUser, mutate } = useCurrentUser();

  const isFavorite = useMemo(() => {
    const list = currentUser?.favorites || [];

    return list.includes(movieID);
  }, [currentUser, movieID]);

  const toggleFavorite = useCallback(async () => {
    let response;

    if (isFavorite) {
      response = await axios.delete("/api/favorite", { data: { movieID } });
    } else {
      response = await axios.post("/api/favorite", { movieID });
    }

    const updatedFavoriteIds = response?.data?.favoriteIds;

    mutate({
      ...currentUser,
      favoriteIds: updatedFavoriteIds,
    });

    mutateFavorites();
  }, [movieID, isFavorite, currentUser, mutate, mutateFavorites]);

  const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus

  return (
    <div onClick={toggleFavorite}
      className="
      cursor-pointer
      group/item
      w-6
      h-6
      lg:w-10
      lg:h-10
      border-white
      border-2
      rounded-full
      flex
      justify-center
      items-center
      transition
      hover:border-neutral-300
    "
    >
      <Icon className="text-white" size={30} />
    </div>
  );
};

export default FavoriteButton;
