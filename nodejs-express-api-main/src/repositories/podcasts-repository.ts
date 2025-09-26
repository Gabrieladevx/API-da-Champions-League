import { PodcastModel } from "../models/podcast-model";
import podcasts from "./podcasts.json";

export const repositoryPodcast = async (
  podcastName?: string
): Promise<PodcastModel[]> => {
  let data: PodcastModel[] = podcasts as unknown as PodcastModel[];

  if (podcastName) {
    data = data.filter(
      (podcast: PodcastModel) => podcast.podcastName === podcastName
    );
  }

  return data;
};
