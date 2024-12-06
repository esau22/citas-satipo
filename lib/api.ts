import { Database } from "@/types/bd_type";
import { supabase } from "./supabase";

export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profile: profiles(username, avatar_url)")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.log(error);
    return [];
  } else {
    console.log(data);
    return data;
  }
};

export const downloadAvatar = async (path: string): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(path);
    if (error) throw error;
    const fr = new FileReader();
    fr.readAsDataURL(data);
    return new Promise((resolve) => {
      fr.onload = () => {
        resolve(fr.result as string);
      };
    });
  } catch (err) {
    console.log("error", err);
    return "";
  }
};

export const getSignedAvatarUrl = async (path: string): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .createSignedUrl(path, 60 * 60); // Válida por 1 hora
    if (error) {
      console.error("Error generando URL firmada:", error.message);
      throw error;
    }
    return data.signedUrl;
  } catch (err) {
    console.error("Error en getSignedAvatarUrl:", err);
    return "";
  }
};

export type Posts = Awaited<ReturnType<typeof fetchPosts>>;
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Post = Posts[number];

export const fetchLikes = async (postId: string) => {
  const { data, error } = await supabase
    .from("post_likes")
    .select("user_id, id")
    .eq("post_id", postId);

  if (error) {
    console.log("error", error);
    return [];
  } else {
    return data;
  }
};

export type Likes = Awaited<ReturnType<typeof fetchLikes>>;
export type Like = Likes[number];

export const fetchContacts = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("username, avatar_url, id")
    .neq("id", userId);
  if (error) {
    console.log("error", error);
    return [];
  } else {
    return data;
  }
};

export type ContactFulls = Awaited<ReturnType<typeof fetchContacts>>;
export type ContactFull = ContactFulls[number];

export const fetchChats = async (userId: string) => {
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("username, avatar_url, id")
    .neq("id", userId);

  if (profilesError) {
    console.log("Error al obtener los perfiles:", profilesError);
    return [];
  }

  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("sender_id, receiver_id, content, created_at, read")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (messagesError) {
    console.log("Error al obtener los mensajes:", messagesError);
    return [];
  }

  const profilesWithChats = profiles.filter((profile) =>
    messages.some(
      (msg) =>
        (msg.sender_id === userId && msg.receiver_id === profile.id) ||
        (msg.receiver_id === userId && msg.sender_id === profile.id)
    )
  );

  const chats = profilesWithChats.map((profile) => {
    const lastMessage = messages.find(
      (msg) =>
        (msg.sender_id === userId && msg.receiver_id === profile.id) ||
        (msg.receiver_id === userId && msg.sender_id === profile.id)
    );

    const unreadCount = messages.filter(
      (msg) =>
        msg.sender_id === profile.id && // Mensajes enviados por el contacto
        msg.receiver_id === userId && // Recibidos por el usuario actual
        !msg.read // Mensajes no leídos
    ).length;

    return {
      id: profile.id,
      username: profile.username,
      avatar_url: profile.avatar_url,
      last_message: lastMessage ? lastMessage.content : "No hay mensajes",
      created_at: lastMessage ? lastMessage.created_at : "",
      unread_count: unreadCount || 0,
    };
  });

  // Llamar a la función para marcar mensajes como leídos para cada chat
  // Ordenar los chats por la fecha del último mensaje
  chats.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return chats;
};

export type Contacts = Awaited<ReturnType<typeof fetchChats>>;
export type Contact = Contacts[number];

export const markMessagesAsRead = async (userId: string, contactId: string) => {
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("receiver_id", userId)
    .eq("sender_id", contactId);

  if (error) {
    console.error("Error al marcar mensajes como leídos:", error);
  }
};

export const fetchMessages = async (userId: string, contactId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .or(`sender_id.eq.${contactId},receiver_id.eq.${contactId}`)
    .order("created_at", { ascending: false });

  if (error) {
    //console.log("Error al obtener mensajes:", error.message);
    return [];
  }

  if (data && data.length > 0) {
    // Filtramos los mensajes que aún no están marcados como leídos
    const unreadMessages = data.filter((message) => !message.read);

    if (unreadMessages.length > 0) {
      //console.log("Mensajes no leídos a actualizar:", unreadMessages);

      const updateResponse = await supabase
        .from("messages")
        .update({ read: true })
        .in(
          "id",
          unreadMessages.map((message) => message.id)
        );

      if (updateResponse.error) {
        console.log(
          "Error al actualizar mensajes:",
          updateResponse.error.message
        );
      } else {
        //console.log("Mensajes actualizados correctamente:", updateResponse);
      }
    } else {
      //console.log("No hay mensajes no leídos para actualizar.");
    }
  }

  return data;
};

export type Messages = Awaited<ReturnType<typeof fetchMessages>>;
export type Message = Messages[number];
