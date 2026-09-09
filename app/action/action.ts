'use server';
import { type ModelMessage, UIMessage } from 'ai';
import { getAuthServer } from '@/lib/insforgeServer';
import { generateGeminiText } from '@/lib/gemini';

export const generateProjectTitle = async (message: string) => {
  try {
    const text = await generateGeminiText({
      system: `
    You are an AI assistant that generates very short project names based on the user's prompt.
    - Keep it under 5 words.
    - Capitalize words appropriately.
    - Do not include special characters.
    - Return ONLY the name, nothing else.`,
      messages: [{ role: 'user', content: message }],
    });

    return text.trim() || 'Untitled Project';
  } catch (error) {
    console.log(error, 'Project title error');
    return 'Untitled Project';
  }
};

export const convertModelMessages = async (
  messages: UIMessage[],
): Promise<ModelMessage[]> => {
  const modelMessages = messages.map((message: UIMessage): ModelMessage => {
    const contentParts: Array<
      | { type: 'text'; text: string }
      | { type: 'file'; data: string; mediaType: string }
    > = [];

    for (const part of message.parts) {
      if (
        part.type === 'text' &&
        typeof part.text === 'string' &&
        part.text.trim()
      ) {
        contentParts.push({
          type: 'text',
          text: part.text,
        });
      } else if (part.type === 'file') {
        if (part.mediaType?.startsWith('image/') && part.url) {
          contentParts.push({
            type: 'file',
            data: part.url,
            mediaType: part.mediaType,
          });
        }
      }
    }

    const content =
      contentParts.length === 1 && contentParts[0]?.type === 'text'
        ? contentParts[0].text
        : contentParts;

    switch (message.role) {
      case 'system':
        return {
          role: 'system',
          content:
            typeof content === 'string'
              ? content
              : content
                  .filter((part) => part.type === 'text')
                  .map((part) => part.text)
                  .join('\n'),
        };
      case 'assistant':
        return { role: 'assistant', content };
      case 'user':
        return { role: 'user', content };
    }
  });

  return modelMessages;
};

export const deletePageAction = async (slugId: string, pageId: string) => {
  try {
    const { user, insforge } = await getAuthServer();
    if (!user) return { error: 'Unauthorized' };

    const { data: project } = await insforge.database
      .from('projects')
      .select('id')
      .eq('slugId', slugId)
      .single();
    if (!project) return { error: 'Project not found' };

    await insforge.database
      .from('pages')
      .delete()
      .eq('projectId', project.id)
      .eq('id', pageId);

    return { success: true };
  } catch (error) {
    return { error: `Internal server error: ${error}` };
  }
};
