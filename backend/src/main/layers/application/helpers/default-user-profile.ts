const DEFAULT_BIOS = [
  "Pet lover 🐶",
  "Cat cuddler 😺",
  "Dog walk enthusiast 🐕",
  "Paws and smiles 🐾",
  "Living for belly rubs 🐕",
  "Treat supplier on duty 🍖",
  "Happy tails only 🐶",
  "Rescue heart forever 🐾",
  "Fur baby fan club 🐕",
  "Snuggles and whiskers 😸",
  "Adventure buddy for pets 🌿",
  "More pets, more joy 🐾",
  "Playtime professional 🎾",
  "Proud pet parent 🐶",
  "Muddy paws welcome 🌧️",
  "Nap time with pets 😴",
  "Fetch first, plans later 🐕",
  "Whiskers make life better 😺",
  "Sunshine and paw prints ☀️",
  "Always stopping for a pet 🐾",
] as const;

export const pickRandomDefaultBio = () => {
  const randomIndex = Math.floor(Math.random() * DEFAULT_BIOS.length);
  return DEFAULT_BIOS[randomIndex];
};

export const makeDefaultUserProfile = (name: string) => ({
  displayName: name,
  bio: pickRandomDefaultBio(),
  picture: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${crypto.randomUUID()}&size=160`,
});
