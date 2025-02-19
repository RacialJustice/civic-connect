import { Router } from 'express';
import { supabase } from '../db';
import { sendNotification } from '../services/notifications';
import { type SelectEmergencyService } from '@shared/schema';

const router = Router();

// Create new emergency alert
router.post('/emergency/alert', async (req, res) => {
  try {
    const {
      location,
      type,
      description,
      peopleAffected,
      assistanceNeeded,
      coordinates,
      userId,
      ward,
      constituency,
      county
    } = req.body;

    // Create alert record
    const { data: alert, error } = await supabase
      .from('emergency_alerts')
      .insert({
        location,
        type,
        description,
        people_affected: peopleAffected,
        assistance_needed: assistanceNeeded,
        coordinates,
        user_id: userId,
        ward,
        constituency,
        county,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    // Find nearest emergency services
    const { data: services } = await supabase
      .from('emergency_services')
      .select('*')
      .eq('type', type)
      .eq('status', 'active')
      .or(`ward.eq.${ward},constituency.eq.${constituency},county.eq.${county}`);

    // Notify emergency services
    if (services?.length) {
      await Promise.all(services.map(async (service: SelectEmergencyService) => {
        // Send notifications to service personnel
        await sendNotification(
          service.phone_numbers[0],
          'URGENT: New Emergency Alert',
          `${type.toUpperCase()} emergency reported at ${location}. ${description}`
        );

        // Log notification
        await supabase
          .from('emergency_notifications')
          .insert({
            alert_id: alert.id,
            service_id: service.id,
            sent_at: new Date().toISOString()
          });
      }));
    }

    res.json({
      message: 'Emergency alert sent successfully',
      alertId: alert.id
    });
  } catch (error) {
    console.error('Emergency alert error:', error);
    res.status(500).json({ 
      error: 'Failed to process emergency alert',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Mark alert as resolved
router.post('/emergency/alert/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution_notes } = req.body;

    const { data: alert, error } = await supabase
      .from('emergency_alerts')
      .update({ 
        status: 'resolved',
        resolved_at: new Date().toISOString(),
        resolution_notes
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Notify original reporter
    if (alert.user_id) {
      const { data: user } = await supabase
        .from('users')
        .select('email')
        .eq('id', alert.user_id)
        .single();

      if (user?.email) {
        await sendNotification(
          user.email,
          'Emergency Alert Resolved',
          `Your emergency alert has been resolved. ${resolution_notes || ''}`
        );
      }
    }

    res.json({ message: 'Alert marked as resolved' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

// Get active alerts for area
router.get('/emergency/alerts', async (req, res) => {
  try {
    const { ward, constituency, county } = req.query;

    let query = supabase
      .from('emergency_alerts')
      .select('*')
      .eq('status', 'active');

    if (ward) query = query.eq('ward', ward);
    if (constituency) query = query.eq('constituency', constituency);
    if (county) query = query.eq('county', county);

    const { data: alerts, error } = await query;

    if (error) throw error;
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

export default router;