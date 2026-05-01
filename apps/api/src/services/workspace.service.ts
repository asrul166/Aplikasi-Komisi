import { db } from '../db/index.js';
import { workspaces } from '../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../lib/errors.js';

interface UpdateWorkspaceInput {
  name?: string;
  maxSeats?: number;
}

interface UpdateAIConfigInput {
  aiEndpoint?: string;
  anomalySensitivity?: number;
}

export const workspaceService = {
  async getById(id: string) {
    const [ws] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, id));

    if (!ws) throw new NotFoundError('Workspace', id);
    return ws;
  },

  async update(id: string, input: UpdateWorkspaceInput) {
    await this.getById(id);

    const [ws] = await db
      .update(workspaces)
      .set({
        ...(input.name && { name: input.name }),
        ...(input.maxSeats !== undefined && { maxSeats: input.maxSeats }),
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, id))
      .returning();

    return ws;
  },

  async updateAIConfig(id: string, input: UpdateAIConfigInput) {
    await this.getById(id);

    const [ws] = await db
      .update(workspaces)
      .set({
        ...(input.aiEndpoint !== undefined && {
          aiEndpoint: input.aiEndpoint,
        }),
        ...(input.anomalySensitivity !== undefined && {
          anomalySensitivity: input.anomalySensitivity.toFixed(2),
        }),
        updatedAt: new Date(),
      })
      .where(eq(workspaces.id, id))
      .returning();

    return ws;
  },

  /**
   * Ensure a default workspace exists (for initial setup).
   */
  async ensureDefault() {
    const existing = await db.select().from(workspaces).limit(1);
    if (existing.length > 0) return existing[0];

    const [ws] = await db
      .insert(workspaces)
      .values({
        name: 'Default Workspace',
        maxSeats: 50,
      })
      .returning();

    return ws;
  },
};
