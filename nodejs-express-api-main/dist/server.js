"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/server.ts
var http = __toESM(require("http"));

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

// src/controllers/podscasts-controller.ts
var defaultContent = { "Content-Type": "application/json" /* JSON */ };
var getListEpisodes = (req, res) => __async(void 0, null, function* () {
  const content = yield serviceListEpisodes();
  res.writeHead(content.statusCode, defaultContent);
  res.write(JSON.stringify(content.body));
  res.end();
});
var getFilterEpisodes = (req, res) => __async(void 0, null, function* () {
  const content = yield serviceFilterEpisodes(req.url);
  res.writeHead(content.statusCode, defaultContent);
  res.write(JSON.stringify(content.body));
  res.end();
});

// src/controllers/health-controller.ts
var defaultContent2 = { "Content-Type": "application/json" /* JSON */ };
var getHealth = (req, res) => __async(void 0, null, function* () {
  const healthInfo = {
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptime: process.uptime(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      port: process.env.PORT || "3333",
      host: process.env.HOST || "127.0.0.1"
    }
  };
  res.writeHead(200, defaultContent2);
  res.write(JSON.stringify(healthInfo, null, 2));
  res.end();
});

// src/app.ts
var app = (request, response) => __async(void 0, null, function* () {
  var _a;
  const baseUrl = (_a = request.url) == null ? void 0 : _a.split("?")[0];
  if (request.method === "GET" /* GET */ && baseUrl === "/api/list" /* LIST */) {
    yield getListEpisodes(request, response);
    return;
  }
  if (request.method === "GET" /* GET */ && baseUrl === "/api/podcasts" /* ESPISODE */) {
    yield getFilterEpisodes(request, response);
    return;
  }
  if (request.method === "GET" /* GET */ && baseUrl === "/health" /* HEALTH */) {
    yield getHealth(request, response);
    return;
  }
  response.statusCode = 404;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify({ message: "Not Found" }));
});

// src/server.ts
var server = http.createServer(app);
var port = Number(process.env.PORT) || 3333;
var host = process.env.HOST || "127.0.0.1";
server.listen(port, host, () => {
  console.log(`servidor iniciado na porta ${port}`);
});
