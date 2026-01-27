import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHome } from '../../components/mhs/DashboardHome';
import LoadAnimate from '../../components/layout/LoadAnimate';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [krsData, setKrsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingKrs, setLoadingKrs] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/', { replace: true });
      return;
    }
    setUserData(JSON.parse(savedUser));
  }, [navigate]);

  const fetchKrsReal = useCallback(async () => {
    if (!userData?.id) return;
    const token = localStorage.getItem('token'); 

    try {
      const res = await fetch(`http://localhost:5000/api/krs/${userData.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        navigate('/', { replace: true });
        return;
      }

      const data = await res.json();
      
      if (data.success) {
        const resMatkul = await fetch('http://localhost:5000/api/matkul', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (resMatkul.status === 401 || resMatkul.status === 403) {
          localStorage.clear();
          navigate('/', { replace: true });
          return;
        }

        const allMatkul = await resMatkul.json();
        
        if (Array.isArray(allMatkul)) {
          const userMatkul = allMatkul.filter((m: any) => 
            data.data.includes(String(m.id_jadwal))
          );
          setKrsData(userMatkul);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingKrs(false);
    }
  }, [userData?.id, navigate]);

  useEffect(() => {
    if (userData?.id) fetchKrsReal();
  }, [userData, fetchKrsReal]);

  const jatahSKS = useMemo(() => {
    if (!userData) return 0;
    const ip = parseFloat(userData.ipk || "0");
    return ip >= 3.0 ? 24 : 20;
  }, [userData]);

  const chartData = useMemo(() => [
    { semester: 'Sem 1', ipk: 3.4 }, 
    { semester: 'Sem 2', ipk: 3.6 },
    { semester: 'Sem 3', ipk: 3.5 }, 
    { semester: 'Sem 4', ipk: 3.8 }
  ], []);

  return (
    <div className="relative min-h-screen">
      {loading ? (
        <LoadAnimate 
          duration={1500} 
          userType="mahasiswa" 
          onComplete={() => setLoading(false)} 
        />
      ) : (
        <div className="animate-in fade-in duration-700">
          <DashboardHome 
            userData={userData}
            krsData={krsData}
            jatahSKS={jatahSKS}
            chartData={chartData}
            loadingKrs={loadingKrs}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;