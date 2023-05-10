import Hapi from '@hapi/hapi';

export interface Thread extends ThreadBody {
  userId: string;
}
export type RefreshPayload = {
  refreshToken: string;
};
export type ThreadBody = {
  title: string;
  body: string;
};
export interface DetailThread extends ThreadBody {
  id: string;
  title: string;
  body: string;
  date: string;
  username: string;
  comments?: DetailComment[];
}
interface DetailComment extends Comment {
  replies?: Reply[];
}
interface Comment extends Reply {
  likeCount: number;
}
interface Reply {
  id: string;
  username: string;
  date: string;
  content: string;
  isDelete?: boolean;
}
export type ThreadComment = {
  userId: string;
  threadId: string;
  content: string;
};
export type ReplyEntity = {
  commentId: string;
  content: string;
  userId: string;
};

export interface ReplyComment extends ThreadComment {
  commentId: string;
}

export type TokenPayload = {
  username: string;
  id?: string;
};

export type CommentLikePayload = {
  threadId?: string;
  commentId?: string;
  userId?: string;
};
export type Payload = { [key: string]: unknown };

export interface ICredentials extends Record<string, unknown> {
  id: string;
}
export interface IRequestAuth extends Hapi.RequestAuth {
  credentials: ICredentials;
}

export interface IRequest extends Hapi.Request {
  auth: IRequestAuth;
}
