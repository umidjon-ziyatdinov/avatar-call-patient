
import 'server-only';

import { genSaltSync, hashSync } from 'bcrypt-ts';
import { and, asc, desc, eq, gt, gte, inArray, isNull, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import {
  user,
  chat,
  type User,
  document,
  type Suggestion,
  suggestion,
  type Message,
  message,
  vote,
  avatar, type Avatar,
  Call,
  call,
  NewCall
} from './schema';

import { auth } from '@/app/(auth)/auth';







// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error('Failed to get user from database');
    throw error;
  }
}

// export async function createUser(email: string, password: string) {
//   const salt = genSaltSync(10);
//   const hash = hashSync(password, salt);

//   try {
//     return await db.insert(user).values({ email, password: hash });
//   } catch (error) {
//     console.error('Failed to create user in database');
//     throw error;
//   }
// }

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  try {
    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      userId,
      title,
    });
  } catch (error) {
    console.error('Failed to save chat in database');
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    await db.delete(vote).where(eq(vote.chatId, id));
    await db.delete(message).where(eq(message.chatId, id));

    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error('Failed to delete chat by id from database');
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error('Failed to get chats by user from database');
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error('Failed to get chat by id from database');
    throw error;
  }
}

export async function saveMessages({ messages }: { messages: Array<Message> }) {
  try {
    return await db.insert(message).values(messages);
  } catch (error) {
    console.error('Failed to save messages in database', error);
    throw error;
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(message)
      .where(eq(message.chatId, id))
      .orderBy(asc(message.createdAt));
  } catch (error) {
    console.error('Failed to get messages by chat id from database', error);
    throw error;
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  try {
    const [existingVote] = await db
      .select()
      .from(vote)
      .where(and(eq(vote.messageId, messageId)));

    if (existingVote) {
      return await db
        .update(vote)
        .set({ isUpvoted: type === 'up' })
        .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
    }
    return await db.insert(vote).values({
      chatId,
      messageId,
      isUpvoted: type === 'up',
    });
  } catch (error) {
    console.error('Failed to upvote message in database', error);
    throw error;
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return await db.select().from(vote).where(eq(vote.chatId, id));
  } catch (error) {
    console.error('Failed to get votes by chat id from database', error);
    throw error;
  }
}

export async function saveDocument({
  id,
  title,

  content,
  userId,
}: {
  id: string;
  title: string;

  content: string;
  userId: string;
}) {
  try {
    return await db.insert(document).values({
      id,
      title,

      content,
      userId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to save document in database');
    throw error;
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const documents = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(asc(document.createdAt));

    return documents;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const [selectedDocument] = await db
      .select()
      .from(document)
      .where(eq(document.id, id))
      .orderBy(desc(document.createdAt));

    return selectedDocument;
  } catch (error) {
    console.error('Failed to get document by id from database');
    throw error;
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    await db
      .delete(suggestion)
      .where(
        and(
          eq(suggestion.documentId, id),
          gt(suggestion.documentCreatedAt, timestamp),
        ),
      );

    return await db
      .delete(document)
      .where(and(eq(document.id, id), gt(document.createdAt, timestamp)));
  } catch (error) {
    console.error(
      'Failed to delete documents by id after timestamp from database',
    );
    throw error;
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<Suggestion>;
}) {
  try {
    return await db.insert(suggestion).values(suggestions);
  } catch (error) {
    console.error('Failed to save suggestions in database');
    throw error;
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    return await db
      .select()
      .from(suggestion)
      .where(and(eq(suggestion.documentId, documentId)));
  } catch (error) {
    console.error(
      'Failed to get suggestions by document version from database',
    );
    throw error;
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    return await db.select().from(message).where(eq(message.id, id));
  } catch (error) {
    console.error('Failed to get message by id from database');
    throw error;
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db
      .select({ id: message.id })
      .from(message)
      .where(
        and(eq(message.chatId, chatId), gte(message.createdAt, timestamp)),
      );

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      await db
        .delete(vote)
        .where(
          and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds)),
        );

      return await db
        .delete(message)
        .where(
          and(eq(message.chatId, chatId), inArray(message.id, messageIds)),
        );
    }
  } catch (error) {
    console.error(
      'Failed to delete messages by id after timestamp from database',
    );
    throw error;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  try {
    return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  } catch (error) {
    console.error('Failed to update chat visibility in database');
    throw error;
  }
}


export type CreateAvatarInput = Omit<Avatar, 'id'>;
export type UpdateAvatarInput = Partial<Omit<Avatar, 'id'>>;

export async function createAvatar(data: CreateAvatarInput) {
  try {
    const result = await db
      .insert(avatar)
      .values(data)
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error creating avatar:', error);
    throw new Error('Failed to create avatar');
  }
}
export type CreateCallInput = Omit<Call, 'id'>;
export async function createNewCall(data: NewCall) {
  try {
    const result = await db
      .insert(call)
      .values(data)
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error creating call:', error);
    throw new Error('Failed to create call');
  }
}
export async function updateAvatar({ id, data }: { id: string; data: UpdateAvatarInput }) {
  try {
    const result = await db
      .update(avatar)
      .set(data)
      .where(eq(avatar.id, id))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error('Error updating avatar:', error);
    throw new Error('Failed to update avatar');
  }
}
export type UpdateCallInput = Partial<Omit<Call, 'id'>>;
export async function updateCall({ id, data }: { id: string; data: UpdateCallInput }) {
  try {
    const result = await db
      .update(call)
      .set(data)
      .where(eq(call.id, id))
      .returning();

    return result[0] || null;
  } catch (error) {
    console.error('Error updating call:', error);
    throw new Error('Failed to call avatar');
  }
}


export async function deleteAvatarById({ id }: { id: string }) {
  try {
    const [deletedAvatar] = await db
      .delete(avatar)
      .where(eq(avatar.id, id))
      .returning();

    return deletedAvatar;
  } catch (error) {
    console.error('Error deleting avatar:', error);
    throw new Error('Failed to delete avatar');
  }
}

export async function getAvatarById({ id }: { id: string }) {
  try {
    const result = await db
      .select()
      .from(avatar)
      .where(eq(avatar.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error getting avatar:', error);
    throw new Error('Failed to get avatar');
  }
}




export async function getCallById({ id }: { id: string }) {
  try {
    const result = await db
      .select()
      .from(call)
      .where(eq(call.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error('Error getting call:', error);
    throw new Error('Failed to get call');
  }
}


export async function getCallByUserAndAvatarId({ id, avatarId }: { id: string, avatarId: string }) {
  try {
    const result = await db
      .select()
      .from(call)
      .where(and(eq(call.userId, id), eq(call.avatarId, avatarId)))


    return result || null;
  } catch (error) {
    console.error('Error getting call:', error);
    throw new Error('Failed to get call');
  }
}
export async function getAllCallsByUserId(id: string) {
  try {
    const calls = await db.select({
      id: call.id,
      createdAt: call.createdAt,
      endedAt: call.endedAt,
      duration: call.duration,
      userId: call.userId,
      avatarId: call.avatarId,
      status: call.status,
      recordingUrl: call.recordingUrl,
      transcriptUrl: call.transcriptUrl,
      qualityMetrics: call.qualityMetrics,
      conversationMetrics: call.conversationMetrics,
      technicalDetails: call.technicalDetails,
      errorLogs: call.errorLogs,
      metadata: call.metadata,
      // Avatar fields
      avatarName: avatar.name,
      avatarRole: avatar.role,
      avatarImage: avatar.avatarImage
    }).from(call).leftJoin(avatar, eq(call.avatarId, avatar.id)).where(eq(call.userId, id));
    return calls;
  } catch (error) {
    console.error('Error getting all avatars:', error);
    throw new Error('Failed to get all avatars');
  }
}


export async function getAllAvatars() {
  try {
    const avatars = await db.select().from(avatar);
    return avatars;
  } catch (error) {
    console.error('Error getting all avatars:', error);
    throw new Error('Failed to get all avatars');
  }
}

export async function getAllAvatarsForAdmin(userId: string,) {
  try {
    const avatars = await db.select().from(avatar).where(or(eq(avatar.userId, userId), isNull(avatar.userId)));
    return avatars;
  } catch (error) {
    console.error('Error getting all avatars:', error);
    throw new Error('Failed to get all avatars');
  }
}

export async function getAvatarsByUser(userId: string, isActive: boolean = true) {
  try {
    if (!userId) return;

    const avatars = await db.select().from(avatar).where(
      and(
        or(eq(avatar.userId, userId), isNull(avatar.userId)),
        eq(avatar.isActive, isActive)
      )
    );

    return avatars;
  } catch (error) {
    console.error("Error getting all avatars:", error);
    throw new Error("Failed to get all avatars");
  }
}

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserInput = Partial<Omit<User, 'createdAt'>> & { id: string };

export async function createUser(userData: CreateUserInput) {
  try {
    const [newUser] = await db
      .insert(user)
      .values({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

export async function getUserById({ id }: { id: string }) {
  console.log('userId', id)
  try {
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    return foundUser || null;
  } catch (error) {
    console.error('Error getting user by id:', error);
    throw new Error('Failed to get user');
  }
}

export async function getUserByEmail({ email }: { email: string }) {
  try {
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    return foundUser || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw new Error('Failed to get user');
  }
}

export async function getAllUsers({
  includeInactive = false
}: {
  includeInactive?: boolean;
} = {}) {
  try {
    const baseQuery = db.select().from(user);
    const query = includeInactive ? baseQuery : baseQuery.where(eq(user.isActive, true));

    const users = await query;
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw new Error('Failed to get users');
  }
}

export async function updateUser({
  id,
  ...userData
}: UpdateUserInput) {
  try {
    const [updatedUser] = await db
      .update(user)
      .set({
        ...userData,
        updatedAt: new Date()
      })
      .where(eq(user.id, id))
      .returning();

    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

export async function deleteUserById({ id }: { id: string }) {
  try {
    const [deletedUser] = await db
      .delete(user)
      .where(eq(user.id, id))
      .returning();

    return deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Failed to delete user');
  }
}

// Additional useful queries

export async function countUsers({
  includeInactive = false
}: {
  includeInactive?: boolean;
} = {}) {
  try {
    let baseQuery = db.select().from(user);

    if (!includeInactive) {
      baseQuery = baseQuery.where(eq(user.isActive, true)) as typeof baseQuery;
    }

    const users = await baseQuery;
    return users.length;
  } catch (error) {
    console.error('Error counting users:', error);
    throw new Error('Failed to count users');
  }
}

export async function searchUsers({
  query,
  includeInactive = false
}: {
  query: string;
  includeInactive?: boolean;
}) {
  try {
    let dbQuery = db
      .select()
      .from(user)
      .where(
        eq(user.name, query)
        // Note: If you want partial matching, you'll need to use
        // a different database or implement LIKE queries differently
        // depending on your database
      );

    if (!includeInactive) {
      dbQuery = db
        .select()
        .from(user)
        .where(
          and(eq(user.name, query),
            eq(user.isActive, true))

        );

    }

    return await dbQuery;
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('Failed to search users');
  }
}


export async function getAdminUser(passcode: number) {
  try {
    // Validate session
    const session = await auth();
    if (!session?.user?.email) {
      throw new Error('Failed to authenticate admin user');
    }



    // Query user with proper type casting
    const [foundUser] = await db
      .select({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(
        and(
          eq(user.email, session.user.email),
          eq(user.passcode, passcode),
          eq(user.isActive, true)
        )
      )
      .limit(1);

    return foundUser || null;

  } catch (error) {


    // Log unexpected errors but throw a generic error message
    console.error('Error in getAdminUser:', error);
    throw new Error('Failed to authenticate admin user');
  }
}

