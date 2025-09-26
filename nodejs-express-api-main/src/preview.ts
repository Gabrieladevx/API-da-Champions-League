import { serviceListEpisodes } from "./services/list-episodes-service";
import { serviceFilterEpisodes } from "./services/filter-episodes-service";

(async () => {
  const all = await serviceListEpisodes();
  console.log("\nGET /api/list -> status", all.statusCode);
  console.log(JSON.stringify(all.body, null, 2));

  const filtered = await serviceFilterEpisodes("/api/podcasts?p=flow");
  console.log("\nGET /api/podcasts?p=flow -> status", filtered.statusCode);
  console.log(JSON.stringify(filtered.body, null, 2));
})();
