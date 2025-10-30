import { Request, Response } from 'express';
import pool from '../config/database';

export const validatePromoCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Promo code is required'
      });
    }
    
    const result = await pool.query(
      `SELECT id, code, discount_type as "discountType", value, is_active as "isActive" 
       FROM promo_codes WHERE LOWER(code) = LOWER($1)`,
      [code]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid promo code'
      });
    }
    
    const promoCode = result.rows[0];
    
    if (!promoCode.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This promo code has expired'
      });
    }
    
    res.json({
      success: true,
      data: promoCode
    });
    
  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate promo code'
    });
  }
};