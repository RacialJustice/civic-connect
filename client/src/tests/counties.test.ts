import { describe, it, expect } from 'vitest';
import { supabase } from '../lib/supabase';

describe('Leaders API', () => {
 it('should verify final leaders data', async () => {
   const { data, error } = await supabase
     .from('leaders')
     .select('*')
     .order('county');

   expect(error).toBeNull();
   console.log('All leaders with updates:', data?.map(l => ({
     name: l.name,
     county: l.county,
     party: l.party,
     email: l.email
   })));
 });
});