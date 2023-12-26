import Fuse from "fuse.js";

class LocalSearchStore {
  index: Fuse<{ [key: string]: string }>;

  setDocs(events: { [key: string]: string }[]) {
    this.index = new Fuse(events, {
      keys: ["extendedProps.event.summary"],
      includeScore: true,
    });
  }

  search(query: string): { [key: string]: string }[] {
    let result = this.index.search(query);
    console.log("search result:", result);
    let events: { [key: string]: string }[] = [];
    for (let item of result) {
      if (item.score !== undefined && item.score < 0.5) {
        events = [...events, item.item];
      }
    }
    return events;
  }
}

let store = new LocalSearchStore();

export const updateLocalSearchIndex = (events: { [key: string]: any }[]) => {
  store.setDocs(events);
};

export const localSearch = (query: string) => {
  console.log("searching:", query);
  let events = store.search(query);
  return events;
};
