import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../config/database';

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.query;

    let query = 'SELECT id, email, role, first_name, last_name, phone, created_at, is_active FROM users';
    const params: any[] = [];

    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC';

    const [users] = await pool.execute(query, params);

    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const verifyCounselor = async (req: AuthRequest, res: Response) => {
  try {
    const { counselorId } = req.params;
    const adminId = req.user!.id;

    await pool.execute(
      'UPDATE counselors SET is_verified = TRUE, verified_at = CURRENT_TIMESTAMP, verified_by = ? WHERE id = ?',
      [adminId, counselorId]
    );

    res.json({ message: 'Counselor verified successfully' });
  } catch (error) {
    console.error('Verify counselor error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    await pool.execute('UPDATE users SET is_active = ? WHERE id = ?', [
      isActive,
      userId,
    ]);

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPlatformStats = async (req: AuthRequest, res: Response) => {
  try {
    const [userStats] = await pool.execute(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role'
    );
    const [sessionStats] = await pool.execute(
      'SELECT status, COUNT(*) as count FROM sessions GROUP BY status'
    );
    const [resourceStats] = await pool.execute(
      'SELECT resource_type, COUNT(*) as count FROM resources GROUP BY resource_type'
    );

    res.json({
      users: userStats,
      sessions: sessionStats,
      resources: resourceStats,
    });
  } catch (error) {
    console.error('Get platform stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

