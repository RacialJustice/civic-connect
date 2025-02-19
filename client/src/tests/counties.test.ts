// client/src/tests/counties.test.ts
import { describe, it, expect } from 'vitest'
import { supabase } from '../lib/supabase'

describe('Counties Database Tests', () => {
 it('should fetch all counties', async () => {
   const { data, error } = await supabase
     .from('counties')
     .select('*')
     .order('name')
   
   expect(error).toBeNull()
   
   // Log counties for debugging
   console.log('Counties:', data?.map(c => `${c.name} (${c.code})`).join('\n'));
   console.log('Total counties:', data?.length);
   
   expect(data).toHaveLength(47)
   expect(data?.[0]).toHaveProperty('name')
   expect(data?.[0]).toHaveProperty('code')
 })

 it('should filter counties by code', async () => {
   const { data, error } = await supabase
     .from('counties')
     .select()
     .eq('code', '047')

   expect(error).toBeNull()
   expect(data![0].name).toBe('Nairobi')
 })

 it('should search counties by name', async () => {
   const { data, error } = await supabase
     .from('counties')
     .select()
     .ilike('name', '%mba%')

   expect(error).toBeNull()
   expect(data![0].name).toBe('Mombasa')
 })
})