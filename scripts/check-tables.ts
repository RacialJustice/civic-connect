
import { supabase } from '../client/src/lib/supabase';

async function checkTables() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  if (error) {
    if (error.code === 'PGRST116') {
      console.error('Table users does not exist');
    } else {
      console.error('Error:', error);
    }
    return;
  }

  console.log('Tables exist and are accessible');
}

checkTables().catch(console.error);
