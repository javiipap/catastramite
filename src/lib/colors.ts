export const gradients = [
  "from-red-400 to-orange-300",
  "from-orange-400 to-amber-300",
  "from-amber-400 to-yellow-300",
  "from-yellow-400 to-lime-300",
  "from-lime-400 to-green-300",
  "from-green-400 to-emerald-300",
  "from-emerald-400 to-teal-300",
  "from-teal-400 to-cyan-300",
  "from-cyan-400 to-sky-300",
  "from-sky-400 to-blue-300",
  "from-blue-400 to-indigo-300",
  "from-indigo-400 to-violet-300",
  "from-violet-400 to-purple-300",
  "from-purple-400 to-fuchsia-300",
  "from-fuchsia-400 to-pink-300",
  "from-pink-400 to-rose-300",
];

export function stringToColor(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}
