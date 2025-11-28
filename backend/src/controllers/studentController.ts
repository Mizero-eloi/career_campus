import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import pool from '../config/database';

export const updateStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { dateOfBirth, gradeLevel, interests, careerGoals } = req.body;

    const [students] = await pool.execute(
      'SELECT id FROM students WHERE user_id = ?',
      [userId]
    );
    const studentArray = students as any[];
    if (!studentArray || studentArray.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const studentRecordId = studentArray[0].id;

    const updates: string[] = [];
    const values: any[] = [];

    if (dateOfBirth) {
      updates.push('date_of_birth = ?');
      values.push(dateOfBirth);
    }
    if (gradeLevel) {
      updates.push('grade_level = ?');
      values.push(gradeLevel);
    }
    if (interests) {
      updates.push('interests = ?');
      values.push(interests);
    }
    if (careerGoals) {
      updates.push('career_goals = ?');
      values.push(careerGoals);
    }

    if (updates.length > 0) {
      updates.push('profile_completed = TRUE');
      values.push(studentRecordId);
      await pool.execute(
        `UPDATE students SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitAssessment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { assessmentType, responses } = req.body;

    const [students] = await pool.execute(
      'SELECT id FROM students WHERE user_id = ?',
      [userId]
    );
    const studentArray = students as any[];
    if (!studentArray || studentArray.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const studentRecordId = studentArray[0].id;

    // Simple recommendation logic (can be enhanced with ML)
    const results = {
      recommendedPaths: ['Software Engineering', 'Data Science', 'Product Management'],
      matchScores: [85, 78, 72],
    };

    const [result] = await pool.execute(
      'INSERT INTO assessments (student_id, assessment_type, responses, results) VALUES (?, ?, ?, ?)',
      [
        studentRecordId,
        assessmentType,
        JSON.stringify(responses),
        JSON.stringify(results),
      ]
    );

    const insertResult = result as any;

    // Create career recommendations
    for (let i = 0; i < results.recommendedPaths.length; i++) {
      await pool.execute(
        'INSERT INTO career_recommendations (student_id, career_path, match_score, reasoning) VALUES (?, ?, ?, ?)',
        [
          studentRecordId,
          results.recommendedPaths[i],
          results.matchScores[i],
          `Based on your assessment responses, this career path aligns with your interests and skills.`,
        ]
      );
    }

    res.status(201).json({
      message: 'Assessment submitted successfully',
      assessmentId: insertResult.insertId,
      results,
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCareerRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const [students] = await pool.execute(
      'SELECT id FROM students WHERE user_id = ?',
      [userId]
    );
    const studentArray = students as any[];
    if (!studentArray || studentArray.length === 0) {
      return res.json({ recommendations: [] });
    }
    const studentRecordId = studentArray[0].id;

    const [recommendations] = await pool.execute(
      'SELECT * FROM career_recommendations WHERE student_id = ? ORDER BY match_score DESC',
      [studentRecordId]
    );

    res.json({ recommendations });
  } catch (error) {
    console.error('Get career recommendations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const [students] = await pool.execute(
      'SELECT id FROM students WHERE user_id = ?',
      [userId]
    );
    const studentArray = students as any[];
    if (!studentArray || studentArray.length === 0) {
      return res.json({ goals: [] });
    }
    const studentRecordId = studentArray[0].id;

    const [goals] = await pool.execute(
      'SELECT * FROM student_goals WHERE student_id = ? ORDER BY created_at DESC',
      [studentRecordId]
    );

    res.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { goalTitle, goalDescription, targetDate } = req.body;

    const [students] = await pool.execute(
      'SELECT id FROM students WHERE user_id = ?',
      [userId]
    );
    const studentArray = students as any[];
    if (!studentArray || studentArray.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }
    const studentRecordId = studentArray[0].id;

    const [result] = await pool.execute(
      'INSERT INTO student_goals (student_id, goal_title, goal_description, target_date) VALUES (?, ?, ?, ?)',
      [studentRecordId, goalTitle, goalDescription || null, targetDate || null]
    );

    const insertResult = result as any;
    res.status(201).json({
      message: 'Goal created successfully',
      goalId: insertResult.insertId,
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    const { goalId } = req.params;
    const { status, progressNotes } = req.body;

    const updates: string[] = [];
    const values: any[] = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (progressNotes !== undefined) {
      updates.push('progress_notes = ?');
      values.push(progressNotes);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(goalId);

    await pool.execute(
      `UPDATE student_goals SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'Goal updated successfully' });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

