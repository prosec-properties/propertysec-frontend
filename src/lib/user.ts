import { AVATAR_COLORS } from "@/constants/user";

export const getInitials = (nameString: string) => {
  const names = nameString.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }

  return initials;
};

export const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash % 360);
  const saturation = 70 + Math.abs(hash % 30); // 70-100%
  const lightness = 60 + Math.abs(hash % 25); // 60-85%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// export const stringToColor = (str: string) => {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     hash = str.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
// };
