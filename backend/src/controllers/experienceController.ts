import { Request, Response } from 'express';
import pool from '../config/database';
import { Experience } from '../types';

export const getExperiences = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    
    let query = 'SELECT id, title, location, description, price, image_url as "imageUrl" FROM experiences';
    const params: any[] = [];
    
    if (search) {
      query += ' WHERE LOWER(title) LIKE $1 OR LOWER(location) LIKE $1';
      params.push(`%${(search as string).toLowerCase()}%`);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experiences'
    });
  }
};

export const getExperienceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const expResult = await pool.query(
      'SELECT id, title, location, description, price, image_url as "imageUrl" FROM experiences WHERE id = $1',
      [id]
    );
    
    if (expResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    
    const experience: Experience = expResult.rows[0];
    
    const slotsResult = await pool.query(
      `SELECT id, experience_id as "experienceId", start_time as "startTime", 
       total_capacity as "totalCapacity", booked_count as "bookedCount" 
       FROM slots WHERE experience_id = $1 ORDER BY start_time`,
      [id]
    );
    
    experience.slots = slotsResult.rows;
    
    res.json({
      success: true,
      data: experience
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experience details'
    });
  }
};