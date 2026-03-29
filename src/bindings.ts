import type { User, Session } from "lucia";

export type Bindings = {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  MEDIA_PUBLIC_DOMAIN?: string;
};

export type Variables = {
  user: User | null;
  session: Session | null;
};
