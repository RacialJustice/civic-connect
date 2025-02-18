
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import { supabase } from '../../client/src/lib/supabase';

export async function generateTwoFactorSecret(userId: number) {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(userId.toString(), 'CivicConnect', secret);
  
  const qrCode = await QRCode.toDataURL(otpauth);
  
  await supabase
    .from('users')
    .update({ 
      twoFactorSecret: secret,
      twoFactorEnabled: false 
    })
    .eq('id', userId);

  return { secret, qrCode };
}

export async function verifyTwoFactorToken(userId: number, token: string) {
  const { data: user } = await supabase
    .from('users')
    .select('twoFactorSecret')
    .eq('id', userId)
    .single();

  if (!user?.twoFactorSecret) {
    return false;
  }

  return authenticator.verify({
    token,
    secret: user.twoFactorSecret
  });
}

export async function enableTwoFactor(userId: number, token: string) {
  const isValid = await verifyTwoFactorToken(userId, token);
  
  if (isValid) {
    await supabase
      .from('users')
      .update({ twoFactorEnabled: true })
      .eq('id', userId);
    return true;
  }
  
  return false;
}
