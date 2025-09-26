"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
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

// src/repositories/podcasts-repository.ts
var podcasts_repository_exports = {};
__export(podcasts_repository_exports, {
  repositoryPodcast: () => repositoryPodcast
});
module.exports = __toCommonJS(podcasts_repository_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  repositoryPodcast
});
