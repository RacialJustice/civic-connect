import { Router } from 'express';
import { supabase } from '../db';
import { sendEmail } from '../services/email';
import { useAuth } from '@/hooks/use-auth';

const router = Router();

// Get pending content for moderation
router.get('/moderation/queue', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('content_moderation_queue')
      .select(`
        *,
        submitted_by (
          id,
          name,
          email
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add moderator with email verification
router.post('/moderators', async (req, res) => {
  try {
    const { email, permissions } = req.body;
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Add moderator with pending verification
    const { data: moderator, error } = await supabase
      .from('users')
      .update({
        role: 'moderator',
        moderator_verification_token: verificationToken,
        moderator_verification_sent_at: new Date().toISOString()
      })
      .eq('email', email)
      .select()
      .single();

    if (error) throw error;

    // Insert initial permissions
    await supabase.from('moderator_permissions').insert(
      permissions.map((permission: string) => ({
        moderator_id: moderator.id,
        permission,
        content_type: 'all',
        granted_by: req.user.id
      }))
    );

    // Send verification email
    await sendEmail({
      to: email,
      subject: 'Verify Your Moderator Account',
      text: `Click the following link to verify your moderator account: ${process.env.APP_URL}/verify-moderator?token=${verificationToken}`
    });

    res.json({ message: 'Moderator invited successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify moderator email
router.post('/moderators/verify', async (req, res) => {
  try {
    const { token } = req.body;

    const { data: moderator, error } = await supabase
      .from('users')
      .update({
        moderator_verified: true,
        moderator_verification_token: null
      })
      .eq('moderator_verification_token', token)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Moderator verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Log moderation action
router.post('/moderation/actions', async (req, res) => {
  try {
    const { action_type, content_type, content_id, action_details } = req.body;

    const { data, error } = await supabase
      .from('moderator_actions')
      .insert({
        moderator_id: req.user.id,
        action_type,
        content_type,
        content_id,
        action_details,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get moderation activity metrics
router.get('/moderation/metrics', async (req, res) => {
  try {
    const { data: metrics, error } = await supabase
      .rpc('get_moderation_metrics', {
        start_date: req.query.start_date,
        end_date: req.query.end_date
      });

    if (error) throw error;
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;