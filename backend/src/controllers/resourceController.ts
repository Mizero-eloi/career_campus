import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../config/database';

export const getResources = async (req: AuthRequest, res: Response) => {
  try {
    const { category, type } = req.query;

    let query = 'SELECT * FROM resources WHERE is_public = TRUE';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (type) {
      query += ' AND resource_type = ?';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC';

    const [resources] = await pool.execute(query, params);

    res.json({ resources });
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createResource = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, resourceType, fileUrl, externalUrl, category, tags } = req.body;
    const uploadedBy = req.user!.id;

    const [result] = await pool.execute(
      'INSERT INTO resources (title, description, resource_type, file_url, external_url, uploaded_by, category, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title,
        description,
        resourceType,
        fileUrl || null,
        externalUrl || null,
        uploadedBy,
        category || null,
        tags ? JSON.stringify(tags) : null,
      ]
    );

    const insertResult = result as any;
    res.status(201).json({
      message: 'Resource created successfully',
      resourceId: insertResult.insertId,
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const trackResourceAccess = async (req: AuthRequest, res: Response) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user!.id;

    if (req.user!.role !== 'student') {
      return res.status(403).json({ error: 'Only students can track resource access' });
    }

    const [students] = await pool.execute(
      'SELECT id FROM students WHERE user_id = ?',
      [userId]
    );
    const studentArray = students as any[];
    if (!studentArray || studentArray.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const studentRecordId = studentArray[0].id;

    await pool.execute(
      'INSERT INTO student_resource_access (student_id, resource_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE accessed_at = CURRENT_TIMESTAMP',
      [studentRecordId, resourceId]
    );

    res.json({ message: 'Resource access tracked' });
  } catch (error) {
    console.error('Track resource access error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

