import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import pool from '../config/database';

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone, role } = req.body;

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [email, passwordHash, role, firstName, lastName, phone || null]
    );

    const insertResult = result as any;
    const userId = insertResult.insertId;

    // Create role-specific record
    if (role === 'student') {
      await pool.execute('INSERT INTO students (user_id) VALUES (?)', [userId]);
    } else if (role === 'counselor') {
      await pool.execute('INSERT INTO counselors (user_id) VALUES (?)', [
        userId,
      ]);
    }

    // Generate token
    const jwtSecret: string = process.env.JWT_SECRET || 'your-secret-key';
    const options = {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string | number,
    } as SignOptions;
    const token = jwt.sign(
      { id: userId, email, role },
      jwtSecret,
      options
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: userId,
        email,
        role,
        firstName,
        lastName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const [users] = await pool.execute(
      'SELECT id, email, password_hash, role, first_name, last_name, is_active FROM users WHERE email = ?',
      [email]
    );

    const userArray = users as any[];
    if (!userArray || userArray.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userArray[0];

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const jwtSecret: string = process.env.JWT_SECRET || 'your-secret-key';
    const options = {
      expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string | number,
    } as SignOptions;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      options
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    const userId = authReq.user.id;

    const [users] = await pool.execute(
      'SELECT id, email, role, first_name, last_name, phone, created_at FROM users WHERE id = ?',
      [userId]
    );

    const userArray = users as any[];
    if (!userArray || userArray.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userArray[0];

    // Get role-specific data
    let roleData = {};
    if (user.role === 'student') {
      const [students] = await pool.execute(
        'SELECT * FROM students WHERE user_id = ?',
        [userId]
      );
      const studentArray = students as any[];
      roleData = studentArray[0] || {};
    } else if (user.role === 'counselor') {
      const [counselors] = await pool.execute(
        'SELECT * FROM counselors WHERE user_id = ?',
        [userId]
      );
      const counselorArray = counselors as any[];
      roleData = counselorArray[0] || {};
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        createdAt: user.created_at,
        ...roleData,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

