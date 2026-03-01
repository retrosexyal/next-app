import type { NextApiRequest, NextApiResponse } from "next";

import { connectDB, requireAdmin } from "@/helpers/helpers";
import AdminNote from "@/models/admin-note-model";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await connectDB();
  const admin = requireAdmin({ req, res });
  if (!admin) return;

  console.log(admin);

  /* =========================
        GET — список заметок
     ========================= */
  if (req.method === "GET") {
    const notes = await AdminNote.find({ author: admin.id }).sort({
      createdAt: -1,
    });

    return res.json(notes);
  }

  /* =========================
        POST — add / edit / delete
     ========================= */
  if (req.method === "POST") {
    const { action, text, uuid } = req.body;

    try {
      // ➕ ADD
      if (action === "add") {
        const note = await AdminNote.create({
          text,
          author: admin.id,
        });

        return res.json(note);
      }

      // ✏ EDIT
      if (action === "edit") {
        const updated = await AdminNote.findOneAndUpdate(
          { uuid, author: admin.id },
          { text },
          { new: true },
        );

        return res.json(updated);
      }

      // ❌ DELETE
      if (action === "delete") {
        await AdminNote.deleteOne({
          uuid,
          author: admin.id,
        });

        return res.json({ success: true });
      }

      return res.status(400).json("Invalid action");
    } catch (error) {
      return res.status(500).json("Server error");
    }
  }

  return res.status(405).end();
}
