import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../config/database';

export const getCounselors = async (req: Request, res: Response) => {
  try {
    const [counselors] = await pool.execute(
      `SELECT c.*, u.first_name, u.last_name, u.email, u.phone
       FROM counselors c
       JOIN users u ON c.user_id = u.id
       WHERE c.is_verified = TRUE AND u.is_active = TRUE
       ORDER BY u.first_name, u.last_name`
    );

    res.json({ counselors });
  } catch (error) {
    console.error('Get counselors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudentProfiles = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const [counselors] = await pool.execute(
      'SELECT id FROM counselors WHERE user_id = ?',
      [userId]
    );
    const counselorArray = counselors as any[];
    if (!counselorArray || counselorArray.length === 0) {
      return res.status(404).json({ error: 'Counselor profile not found' });
    }
    const counselorRecordId = counselorArray[0].id;

    // Get students who have sessions with this counselor
    const [students] = await pool.execute(
      `SELECT DISTINCT st.*, u.first_name, u.last_name, u.email, u.phone
       FROM students st
       JOIN users u ON st.user_id = u.id
       JOIN sessions s ON s.student_id = st.id
       WHERE s.counselor_id = ?
       ORDER BY u.first_name, u.last_name`,
      [counselorRecordId]
    );

    res.json({ students });
  } catch (error) {
    console.error('Get student profiles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCounselorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { specialization, qualifications, experienceYears, bio } = req.body;

    const [counselors] = await pool.execute(
      'SELECT id FROM counselors WHERE user_id = ?',
      [userId]
    );
    const counselorArray = counselors as any[];
    if (!counselorArray || counselorArray.length === 0) {
      return res.status(404).json({ error: 'Counselor profile not found' });
    }
    const counselorRecordId = counselorArray[0].id;

    const updates: string[] = [];
    const values: any[] = [];

    if (specialization) {
      updates.push('specialization = ?');
      values.push(specialization);
    }
    if (qualifications) {
      updates.push('qualifications = ?');
      values.push(qualifications);
    }
    if (experienceYears !== undefined) {
      updates.push('experience_years = ?');
      values.push(experienceYears);
    }
    if (bio) {
      updates.push('bio = ?');
      values.push(bio);
    }

    if (updates.length > 0) {
      values.push(counselorRecordId);
      await pool.execute(
        `UPDATE counselors SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update counselor profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

