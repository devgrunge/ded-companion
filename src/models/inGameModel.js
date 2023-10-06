
export class InGameModel {
  async enterRoom(playerId, roomId) {
    try {
      // Check if the player is already in the room
      const existingEntry =
        await sql`select * from players_rooms where player_id = ${playerId} and room_id = ${roomId}`;
      if (existingEntry.length > 0) {
        throw new Error("Player is already in the room.");
      }
      // Delete player from players_rooms table
      await sql`insert into players_rooms (player_id, room_id) VALUES (${playerId}, ${roomId})`;
    } catch (error) {
      throw error;
    }
  }

  async checkPlayerRoomRelationship(playerId, roomId) {
    try {
      const existingEntry =
        await sql`select * from players_rooms where player_id = ${playerId} and room_id = ${roomId}`;

      if (existingEntry && existingEntry.length === 0) {
        throw new Error("Player is not in the room.");
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error in checkPlayerRoomRelationship:", error);
      throw error;
    }
  }

  async leaveRoom(playerId, roomId) {
    try {
      await sql`delete from players_rooms where player_id = ${playerId} and room_id = ${roomId}`;
    } catch (error) {
      throw error;
    }
  }
  async getPlayersInRoom(roomId) {
    try {
      const playersInRoom = await sql`
      SELECT
        characters.id,
        characters.name,
        characters.armor_class,
        characters.attributes,
        characters.class,
        characters.hitpoints,
        characters.level
      FROM characters
      JOIN players_rooms ON characters.id = players_rooms.player_id
      WHERE players_rooms.room_id = ${roomId}
    `;
      return playersInRoom;
    } catch (error) {
      throw error;
    }
  }

  async getDungeonMastersInRoom(roomId) {
    try {
      const dungeonMastersInRoom = await sql`
        SELECT dungeon_masters.id, dungeon_masters.dm_name
        FROM dungeon_masters
        JOIN dungeon_masters_rooms ON dungeon_masters.id = dungeon_masters_rooms.dm_id
        WHERE dungeon_masters_rooms.room_id = ${roomId}
      `;
  
      return dungeonMastersInRoom;
    } catch (error) {
      throw error;
    }
  }
}