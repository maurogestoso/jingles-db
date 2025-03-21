import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layout.tsx", [
    index("routes/home.tsx"),
    route("/busqueda", "routes/search.tsx"),
    route("/programas", "routes/episodes-index.tsx"),
    route("/programas/:id", "routes/episodes-detail.tsx"),
    route("/jingleros", "routes/authors-index.tsx"),
    route("/jingleros/:id", "routes/authors-detail.tsx"),
    route("/artistas", "routes/artists-index.tsx"),
    route("/artistas/:id", "routes/artists-detail.tsx"),
  ]),
] satisfies RouteConfig;
