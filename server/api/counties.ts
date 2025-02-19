// ...existing imports...

router.get('/:id/constituencies', async (req, res) => {
  try {
    const { data: constituencies, error } = await supabase
      .from('constituencies')
      .select('*')
      .eq('county_id', req.params.id)
      .order('name');

    if (error) throw error;
    res.json(constituencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/constituencies/:code', async (req, res) => {
  try {
    const { data: constituency, error } = await supabase
      .from('constituencies')
      .select('*, counties(*)')
      .eq('code', req.params.code)
      .single();

    if (error) throw error;
    res.json(constituency);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
