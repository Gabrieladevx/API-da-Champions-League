"use strict";
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/repositories/podcasts.json
var podcasts_default = [
  {
    podcastName: "flow",
    episode: "CBUM - Flow #319",
    videoId: "pQSuQmUfS30",
    categories: ["sa\xFAde", "esporte", "bodybuilder"]
  },
  {
    podcastName: "flow",
    episode: "RUBENS BARRICHELLO - Flow #339",
    videoId: "4KDGTdiOV4I",
    categories: ["esporte", "corrida"]
  },
  {
    podcastName: "flow",
    episode: "Felip\xE3o - Flow #339",
    videoId: "00000",
    categories: ["esporte", "programa\xE7\xE3o"]
  },
  {
    podcastName: "venus",
    episode: "Xuxa",
    videoId: "00000",
    categories: ["humor"]
  }
];

// src/repositories/podcasts-repository.ts
var repositoryPodcast = (podcastName) => __async(void 0, null, function* () {
  let data = podcasts_default;
  if (podcastName) {
    data = data.filter(
      (podcast) => podcast.podcastName === podcastName
    );
  }
  return data;
});

// src/services/list-episodes-service.ts
var serviceListEpisodes = () => __async(void 0, null, function* () {
  let responseFormat = {
    statusCode: 0,
    body: []
  };
  const data = yield repositoryPodcast();
  responseFormat = {
    statusCode: data.length !== 0 ? 200 /* OK */ : 204 /* NoContent */,
    body: data
  };
  return responseFormat;
});

// src/services/filter-episodes-service.ts
var serviceFilterEpisodes = (podcastName) => __async(void 0, null, function* () {
  let responseFormat = {
    statusCode: 0,
    body: []
  };
  const queryString = (podcastName == null ? void 0 : podcastName.split("?p=")[1]) || "";
  const data = yield repositoryPodcast(queryString);
  responseFormat = {
    statusCode: data.length !== 0 ? 200 /* OK */ : 204 /* NoContent */,
    body: data
  };
  return responseFormat;
});

// src/preview.ts
(() => __async(exports, null, function* () {
  const all = yield serviceListEpisodes();
  console.log("\nGET /api/list -> status", all.statusCode);
  console.log(JSON.stringify(all.body, null, 2));
  const filtered = yield serviceFilterEpisodes("/api/podcasts?p=flow");
  console.log("\nGET /api/podcasts?p=flow -> status", filtered.statusCode);
  console.log(JSON.stringify(filtered.body, null, 2));
}))();
