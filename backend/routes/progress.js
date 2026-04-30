import express from 'express';
import { getDb, saveDb } from '../database.js';

const router = express.Router();

const formatResults = (result) => {
  if (!result || result.length === 0) return [];
  const columns = result[0].columns;
  return result[0].values.map(row => {
    const obj = {};
    columns.forEach((col, i) => obj[col] = row[i]);
    return obj;
  });
};

router.get('/', (req, res) => {
  try {
    const db = getDb();
    const result = db.exec('SELECT * FROM quiz_sessions ORDER BY created_at DESC');
    const sessions = formatResults(result);
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

router.post('/save', (req, res) => {
  const { topic, score, total, percentage, time_taken_seconds, questions_json } = req.body;
  try {
    const db = getDb();
    db.run(`
      INSERT INTO quiz_sessions (topic, score, total, percentage, time_taken_seconds, questions_json)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [topic, score, total, percentage, time_taken_seconds, questions_json]);
    saveDb();
    
    const result = db.exec('SELECT last_insert_rowid() AS id');
    const id = result[0].values[0][0];
    res.status(201).json({ id });
  } catch (error) {
    console.error('Error saving progress:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

router.delete('/', (req, res) => {
  try {
    const db = getDb();
    db.run('DELETE FROM quiz_sessions');
    saveDb();
    res.json({ message: 'History cleared successfully' });
  } catch (error) {
    console.error('Error clearing progress:', error);
    res.status(500).json({ error: 'Failed to clear progress' });
  }
});

export default router;
