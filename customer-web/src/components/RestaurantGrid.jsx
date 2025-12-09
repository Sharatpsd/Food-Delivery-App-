import { useNavigate } from "react-router-dom";

export default function RestaurantCard({ item }) {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/restaurant/${item.id}`)}
      className="cursor-pointer ..."
    >
      ...
    </article>
  );
}
