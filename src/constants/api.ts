export const API = {
    auth: {
      login: "/auth/login",
      register: "/auth/register",
      validate: "/auth/validate",
    },
    users: {
      me: "/users/me",
      tokens: "/users/me/tokens",
      gallery: "/users/me/gallery",
    },
    characters: {
      all: "/characters/all", 
      unlocked: "/characters/unlocked",
      unlock: "/characters/unlock", 
      detail: (id: string) => `/characters/${id}`,
      assignPieces: (id: string) => `/characters/${id}/pieces`, 
    },
    gallery: {
      list: "/gallery",
      share: "/gallery/share",
      highlighted: "/gallery/highlighted",
      sharedByCharacter: (id: string) => `/gallery/character/${id}`,
      delete: "/gallery", // Se usará como /gallery/{sharedModelId}
    },
    builds: {
      start: "/builds/start",
      validate: "/builds/validate",
      history: "/builds/history",
      pending: (characterId: string) => `/builds/pending?characterId=${characterId}`,
    },
    
    powers: {
      all: "/powers",
      assign: "/powers/assign",
    },
  };
  