import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../config/database';

export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const { counselorId, scheduledAt, durationMinutes } = req.body;
    const studentId = req.user!.id;

    // Get student_id from students table
    const [students] = await pool.execute(
      'SELECT id FROM students WHERE user_id = ?',
      [studentId]
    );
    const studentArray = students as any[];
    if (!studentArray || studentArray.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const studentRecordId = studentArray[0].id;

    // Verify counselor exists
    const [counselors] = await pool.execute(
      'SELECT id FROM counselors WHERE id = ? AND is_verified = TRUE',
      [counselorId]
    );
    const counselorArray = counselors as any[];
    if (!counselorArray || counselorArray.length === 0) {
      return res.status(404).json({ error: 'Counselor not found or not verified' });
    }

    const [result] = await pool.execute(
      'INSERT INTO sessions (student_id, counselor_id, scheduled_at, duration_minutes) VALUES (?, ?, ?, ?)',
      [studentRecordId, counselorId, scheduledAt, durationMinutes || 60]
    );

    const insertResult = result as any;
    res.status(201).json({
      message: 'Session created successfully',
      sessionId: insertResult.insertId,
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSessions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;

    let sessions;

    if (role === 'student') {
      const [students] = await pool.execute(
        'SELECT id FROM students WHERE user_id = ?',
        [userId]
      );
      const studentArray = students as any[];
      if (!studentArray || studentArray.length === 0) {
        return res.json({ sessions: [] });
      }
      const studentRecordId = studentArray[0].id;

      [sessions] = await pool.execute(
        `SELECT s.*, 
         u.first_name, u.last_name, u.email,
         c.specialization, c.bio
         FROM sessions s
         JOIN counselors c ON s.counselor_id = c.id
         JOIN users u ON c.user_id = u.id
         WHERE s.student_id = ?
         ORDER BY s.scheduled_at DESC`,
        [studentRecordId]
      );
    } else if (role === 'counselor') {
      const [counselors] = await pool.execute(
        'SELECT id FROM counselors WHERE user_id = ?',
        [userId]
      );
      const counselorArray = counselors as any[];
      if (!counselorArray || counselorArray.length === 0) {
        return res.json({ sessions: [] });
      }
      const counselorRecordId = counselorArray[0].id;

      [sessions] = await pool.execute(
        `SELECT s.*, 
         u.first_name, u.last_name, u.email
         FROM sessions s
         JOIN students st ON s.student_id = st.id
         JOIN users u ON st.user_id = u.id
         WHERE s.counselor_id = ?
         ORDER BY s.scheduled_at DESC`,
        [counselorRecordId]
      );
    } else {
      // Admin can see all sessions
      [sessions] = await pool.execute(
        `SELECT s.*, 
         st_u.first_name as student_first_name, st_u.last_name as student_last_name,
         c_u.first_name as counselor_first_name, c_u.last_name as counselor_last_name
         FROM sessions s
         JOIN students st ON s.student_id = st.id
         JOIN users st_u ON st.user_id = st_u.id
         JOIN counselors c ON s.counselor_id = c.id
         JOIN users c_u ON c.user_id = c_u.id
         ORDER BY s.scheduled_at DESC`
      );
    }

    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { status, notes, rating, feedback } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      values.push(notes);
    }
    if (rating !== undefined) {
      updates.push('rating = ?');
      values.push(rating);
    }
    if (feedback !== undefined) {
      updates.push('feedback = ?');
      values.push(feedback);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(sessionId);

    await pool.execute(
      `UPDATE sessions SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'Session updated successfully' });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

