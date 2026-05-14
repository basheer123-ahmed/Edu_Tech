import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/student';

export const useStudentData = () => {
  const [dashboard, setDashboard] = useState(null);
  const [progress, setProgress] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [streak, setStreak] = useState(null);
  const [skills, setSkills] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, progRes, lbRes, streakRes, skillsRes, analyticsRes, recsRes] = await Promise.all([
        axios.get(`${API}/dashboard`),
        axios.get(`${API}/progress`),
        axios.get(`${API}/leaderboard`),
        axios.get(`${API}/streak`),
        axios.get(`${API}/skills`),
        axios.get(`${API}/analytics`),
        axios.get(`${API}/recommendations`)
      ]);
      setDashboard(dashRes.data);
      setProgress(progRes.data);
      setLeaderboard(lbRes.data);
      setStreak(streakRes.data);
      setSkills(skillsRes.data);
      setAnalytics(analyticsRes.data);
      setRecommendations(recsRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    // Refresh every 2 minutes
    const interval = setInterval(fetchAll, 120000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { dashboard, progress, leaderboard, streak, skills, analytics, recommendations, loading, error, refetch: fetchAll };
};
