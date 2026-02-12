export type SocialLinks = {
  instagram?: string;
  linkedin?: string;
  github?: string;
};

export type Member = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  socials: SocialLinks;
};
