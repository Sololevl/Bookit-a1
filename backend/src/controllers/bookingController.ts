import { Request, Response } from 'express';
import pool from '../config/database';
import { CreateBookingRequest } from '../types';

export const createBooking = async (req: Request, res: Response) => {
  const client = await pool.connect();
  
  try {
    const { slotId, quantity, user, total, promoCode }: CreateBookingRequest = req.body;
    
    if (!slotId || !quantity || !user?.name || !user?.email || !total) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    await client.query('BEGIN');
    
    const slotResult = await client.query(
      `SELECT id, total_capacity, booked_count 
       FROM slots WHERE id = $1 FOR UPDATE`,
      [slotId]
    );
    
    if (slotResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }
    
    const slot = slotResult.rows[0];
    const available = slot.total_capacity - slot.booked_count;
    
    if (quantity > available) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: `Only ${available} slots available. Please reduce quantity.`
      });
    }
    
    await client.query(
      'UPDATE slots SET booked_count = booked_count + $1 WHERE id = $2',
      [quantity, slotId]
    );
    
    const refId = `HUF${Date.now().toString().slice(-6)}`;
    
    const bookingResult = await client.query(
      `INSERT INTO bookings 
       (ref_id, slot_id, user_name, user_email, quantity, total_amount, promo_code) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [refId, slotId, user.name, user.email, quantity, total, promoCode || null]
    );
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      data: {
        refId: bookingResult.rows[0].ref_id,
        message: 'Booking confirmed successfully'
      }
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking'
    });
  } finally {
    client.release();
  }
};