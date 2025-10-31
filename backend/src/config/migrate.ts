import pool from './database';

export const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create experiences table
    await client.query(`
      CREATE TABLE IF NOT EXISTS experiences (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create slots table
    await client.query(`
      CREATE TABLE IF NOT EXISTS slots (
        id SERIAL PRIMARY KEY,
        experience_id VARCHAR(100) REFERENCES experiences(id) ON DELETE CASCADE,
        start_time TIMESTAMP NOT NULL,
        total_capacity INTEGER NOT NULL,
        booked_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create promo_codes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type VARCHAR(20) NOT NULL,
        value NUMERIC(10, 2) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        ref_id VARCHAR(50) UNIQUE NOT NULL,
        slot_id INTEGER REFERENCES slots(id),
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        total_amount NUMERIC(10, 2) NOT NULL,
        promo_code VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('✅ Tables created successfully');

    // Insert sample data
    await insertSampleData(client);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

const insertSampleData = async (client: any) => {
  try {
    // Insert experiences
    const experiences = [
      {
        id: 'kayaking-udupi',
        title: 'Kayaking',
        location: 'Udupi',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included. Helmet and Life jackets along with an expert will accompany in kayaking.',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop'
      },
      {
        id: 'nandi-hills-sunrise',
        title: 'Nandi Hills Sunrise',
        location: 'Bangalore',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 899,
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'
      },
      {
        id: 'coffee-trail',
        title: 'Coffee Trail',
        location: 'Coorg',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 1299,
        imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop'
      },
      {
        id: 'kayaking-karnataka',
        title: 'Kayaking',
        location: 'Udupi, Karnataka',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=600&h=400&fit=crop'
      },
      {
        id: 'boat-cruise',
        title: 'Boat Cruise',
        location: 'Sunderban',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop'
      },
      {
        id: 'bungee-jumping',
        title: 'Bungee Jumping',
        location: 'Manali',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop'
      },
      {
        id: 'coffee-trail-2',
        title: 'Coffee Trail',
        location: 'Coorg',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 1299,
        imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop'
      },
      {
        id: 'scuba-diving-goa',
        title: 'Scuba Diving',
        location: 'Goa',
        description: 'Curated small-group experience. Certified guide. Safety first with gear included.',
        price: 1499,
        imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop'
      }
    ];

    for (const exp of experiences) {
      await client.query(
        'INSERT INTO experiences (id, title, location, description, price, image_url) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING',
        [exp.id, exp.title, exp.location, exp.description, exp.price, exp.imageUrl]
      );
    }

    
        // Insert slots for ALL experiences
    const slots = [
    // Kayaking Udupi
    { experienceId: 'kayaking-udupi', startTime: '2025-10-22 07:00:00', totalCapacity: 5, bookedCount: 1 },
    { experienceId: 'kayaking-udupi', startTime: '2025-10-22 09:00:00', totalCapacity: 5, bookedCount: 3 },
    { experienceId: 'kayaking-udupi', startTime: '2025-10-22 11:00:00', totalCapacity: 5, bookedCount: 0 },
    { experienceId: 'kayaking-udupi', startTime: '2025-10-22 13:00:00', totalCapacity: 5, bookedCount: 5 },
    { experienceId: 'kayaking-udupi', startTime: '2025-10-23 09:00:00', totalCapacity: 5, bookedCount: 0 },
    { experienceId: 'kayaking-udupi', startTime: '2025-10-24 09:00:00', totalCapacity: 5, bookedCount: 2 },
    { experienceId: 'kayaking-udupi', startTime: '2025-10-25 09:00:00', totalCapacity: 5, bookedCount: 0 },
    { experienceId: 'kayaking-udupi', startTime: '2025-10-26 09:00:00', totalCapacity: 5, bookedCount: 0 },
    
    // Coffee Trail Coorg
    { experienceId: 'coffee-trail', startTime: '2025-11-01 08:00:00', totalCapacity: 8, bookedCount: 0 },
    { experienceId: 'coffee-trail', startTime: '2025-11-01 14:00:00', totalCapacity: 8, bookedCount: 2 },
    { experienceId: 'coffee-trail', startTime: '2025-11-02 08:00:00', totalCapacity: 8, bookedCount: 0 },
    { experienceId: 'coffee-trail', startTime: '2025-11-03 08:00:00', totalCapacity: 8, bookedCount: 0 },
    
    // Nandi Hills Sunrise
    { experienceId: 'nandi-hills-sunrise', startTime: '2025-10-25 05:00:00', totalCapacity: 10, bookedCount: 0 },
    { experienceId: 'nandi-hills-sunrise', startTime: '2025-10-26 05:00:00', totalCapacity: 10, bookedCount: 4 },
    { experienceId: 'nandi-hills-sunrise', startTime: '2025-10-27 05:00:00', totalCapacity: 10, bookedCount: 0 },
    { experienceId: 'nandi-hills-sunrise', startTime: '2025-10-28 05:00:00', totalCapacity: 10, bookedCount: 0 },
    
    // Bungee Jumping
    { experienceId: 'bungee-jumping', startTime: '2025-10-28 10:00:00', totalCapacity: 6, bookedCount: 0 },
    { experienceId: 'bungee-jumping', startTime: '2025-10-28 13:00:00', totalCapacity: 6, bookedCount: 3 },
    { experienceId: 'bungee-jumping', startTime: '2025-10-29 10:00:00', totalCapacity: 6, bookedCount: 0 },
    { experienceId: 'bungee-jumping', startTime: '2025-10-30 10:00:00', totalCapacity: 6, bookedCount: 0 },
    
    // Boat Cruise
    { experienceId: 'boat-cruise', startTime: '2025-11-05 09:00:00', totalCapacity: 12, bookedCount: 0 },
    { experienceId: 'boat-cruise', startTime: '2025-11-05 15:00:00', totalCapacity: 12, bookedCount: 5 },
    { experienceId: 'boat-cruise', startTime: '2025-11-06 09:00:00', totalCapacity: 12, bookedCount: 0 },
    { experienceId: 'boat-cruise', startTime: '2025-11-07 09:00:00', totalCapacity: 12, bookedCount: 0 },
    
    // Kayaking Karnataka
    { experienceId: 'kayaking-karnataka', startTime: '2025-10-30 07:00:00', totalCapacity: 5, bookedCount: 0 },
    { experienceId: 'kayaking-karnataka', startTime: '2025-10-30 09:00:00', totalCapacity: 5, bookedCount: 0 },
    { experienceId: 'kayaking-karnataka', startTime: '2025-10-31 07:00:00', totalCapacity: 5, bookedCount: 0 },
    
    // Coffee Trail 2
    { experienceId: 'coffee-trail-2', startTime: '2025-11-10 08:00:00', totalCapacity: 8, bookedCount: 0 },
    { experienceId: 'coffee-trail-2', startTime: '2025-11-10 14:00:00', totalCapacity: 8, bookedCount: 0 },
    { experienceId: 'coffee-trail-2', startTime: '2025-11-11 08:00:00', totalCapacity: 8, bookedCount: 0 },
    
        // Scuba Diving Goa
    { experienceId: 'scuba-diving-goa', startTime: '2025-11-15 08:00:00', totalCapacity: 8, bookedCount: 2 },
    { experienceId: 'scuba-diving-goa', startTime: '2025-11-15 13:00:00', totalCapacity: 8, bookedCount: 5 },
    { experienceId: 'scuba-diving-goa', startTime: '2025-11-16 08:00:00', totalCapacity: 8, bookedCount: 0 },
    { experienceId: 'scuba-diving-goa', startTime: '2025-11-17 08:00:00', totalCapacity: 8, bookedCount: 1 },
            
    ];

    for (const slot of slots) {
      await client.query(
        'INSERT INTO slots (experience_id, start_time, total_capacity, booked_count) VALUES ($1, $2, $3, $4)',
        [slot.experienceId, slot.startTime, slot.totalCapacity, slot.bookedCount]
      );
    }

    // Insert promo codes
    const promoCodes = [
      { code: 'SAVE10', discountType: 'percentage', value: 10, isActive: true },
      { code: 'FLAT100', discountType: 'flat', value: 100, isActive: true },
      { code: 'EXPIRED', discountType: 'flat', value: 50, isActive: false }
    ];

    for (const promo of promoCodes) {
      await client.query(
        'INSERT INTO promo_codes (code, discount_type, value, is_active) VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO NOTHING',
        [promo.code, promo.discountType, promo.value, promo.isActive]
      );
    }

    console.log('✅ Sample data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    throw error;
  }
};
