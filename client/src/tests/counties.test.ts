import { describe, it, expect } from 'vitest';
import { supabase } from '../lib/supabase';

describe('MPs Database', () => {
  it('should create MPs table', async () => {
    const { error } = await supabase.rpc('create_mps_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS mps (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          constituency TEXT NOT NULL,
          party TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
        );
      `
    });
    expect(error).toBeNull();
  });

  it('should insert MPs data', async () => {
    const mps = [
      { name: "Adagala, Beatrice Kahai", constituency: "Vihiga (CWR)", party: "ANC" },
      { name: "Denar, Joseph Hamisi", constituency: "Nominated", party: "ANC" },
      { name: "Gimose, Charles Gumini", constituency: "Hamisi", party: "ANC" },
      { name: "Ikana, Frederick Lusuli", constituency: "Shinyalu", party: "ANC" },
      { name: "Injendi, Moses Malulu", constituency: "Malava", party: "ANC" },
      // Add more in batches to avoid oversized request
    ];

    const { error } = await supabase
      .from('mps')
      .upsert(mps);

    expect(error).toBeNull();
  });

  it('should verify MP count by party', async () => {
    const { data, error } = await supabase
      .from('mps')
      .select('party, count')
      .select('*')
      .order('party');

    expect(error).toBeNull();
    console.log('MPs by party:', data?.reduce((acc, mp) => {
      acc[mp.party] = (acc[mp.party] || 0) + 1;
      return acc;
    }, {}));
  });
});