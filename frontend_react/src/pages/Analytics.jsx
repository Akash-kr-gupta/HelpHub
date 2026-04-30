import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  PointElement, 
  LineElement, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

export default function Analytics() {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, ngos: 0, donations: 0 });
  const token = localStorage.getItem('helphub_token');

  useEffect(() => {
    axios.get('/api/analytics', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setStats(res.data));
  }, [token]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: { family: "'Inter', sans-serif", weight: '600' }
        }
      }
    },
    scales: {
      y: { grid: { display: false } },
      x: { grid: { display: false } }
    }
  };

  const barData = {
    labels: ['Total', 'Completed', 'Pending', 'Donations', 'NGOs'],
    datasets: [
      {
        label: 'Platform Activity',
        data: [stats.total, stats.completed, stats.pending, stats.donations, stats.ngos],
        backgroundColor: [
          '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'
        ],
        borderRadius: 12,
      },
    ],
  };

  const pieData = {
    labels: ['Completed Cases', 'Pending Cases'],
    datasets: [
      {
        data: [stats.completed, stats.pending],
        backgroundColor: ['#10b981', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '4rem 1rem'
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>Platform <span className="text-gradient">Insights</span></h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Real-time data and impact metrics.</p>
          </div>
          <div className="glass" style={{ padding: '12px 24px', borderRadius: '16px', background: 'white' }}>
            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>LIVE UPDATES</span>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '3rem' }}>
          <StatCard label="Total Requests" value={stats.total} icon="fa-bullhorn" color="#6366f1" />
          <StatCard label="Successful Aids" value={stats.completed} icon="fa-check-circle" color="#10b981" />
          <StatCard label="NGO Partners" value={stats.ngos} icon="fa-building" color="#3b82f6" />
          <StatCard label="Donations" value={stats.donations} icon="fa-hand-holding-heart" color="#ef4444" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '30px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass" 
            style={{ padding: '2.5rem', borderRadius: '32px', background: 'white' }}
          >
            <h3 style={{ fontWeight: 800, marginBottom: '2rem' }}>Request Distribution</h3>
            <Bar data={barData} options={chartOptions} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass" 
            style={{ padding: '2.5rem', borderRadius: '32px', background: 'white' }}
          >
            <h3 style={{ fontWeight: 800, marginBottom: '2rem' }}>Efficiency Ratio</h3>
            <Pie data={pieData} options={{ ...chartOptions, cutout: '60%' }} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass" 
      style={{ padding: '20px', borderRadius: '24px', background: 'white', textAlign: 'center' }}
    >
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
    </motion.div>
  );
}
