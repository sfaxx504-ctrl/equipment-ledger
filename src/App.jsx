import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { PlusCircle, List, ChevronLeft, MapPin, Camera, Save, Info, Trash2 } from 'lucide-react';
import './index.css';

// --- Components ---

const TopScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="container fade-in">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>設備台帳システム</h1>
        <p style={{ color: 'var(--text-muted)' }}>工場の設備情報をスマートに管理</p>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <button 
          className="glass-card btn" 
          onClick={() => navigate('/create')}
          style={{ height: '240px', flexDirection: 'column', fontSize: '1.25rem', width: '100%' }}
        >
          <PlusCircle size={48} color="var(--primary)" />
          <span>設備台帳作成</span>
        </button>
        <button 
          className="glass-card btn" 
          onClick={() => navigate('/list')}
          style={{ height: '240px', flexDirection: 'column', fontSize: '1.25rem', width: '100%' }}
        >
          <List size={48} color="var(--primary)" />
          <span>設備台帳リスト</span>
        </button>
      </div>
    </div>
  );
};

const CreateScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    remarks: '',
    photos: [],
    mapData: null
  });

  const handleSave = () => {
    if (!formData.name) {
      alert('設備名称を入力してください');
      return;
    }
    const existingData = JSON.parse(localStorage.getItem('equipment-ledger') || '[]');
    const newData = { ...formData, id: Date.now().toString(), createdAt: new Date().toISOString() };
    localStorage.setItem('equipment-ledger', JSON.stringify([...existingData, newData]));
    navigate('/list');
  };

  return (
    <div className="container fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn" onClick={() => navigate('/')} style={{ padding: '8px' }}>
          <ChevronLeft size={24} />
        </button>
        <h2>設備台帳作成</h2>
      </div>

      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>設備名称</label>
          <input 
            type="text" 
            placeholder="設備名称を入力" 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>設置場所</label>
          <input 
            type="text" 
            placeholder="設置場所を入力" 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>工場内地図 (赤ペンで場所を指定)</label>
          <MapCanvas onSave={(data) => setFormData({...formData, mapData: data})} />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>写真 (最大2枚)</label>
          <PhotoUpload onPhotosChange={(photos) => setFormData({...formData, photos})} />
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>備考欄</label>
          <textarea 
            rows="4" 
            placeholder="備考を入力" 
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
            value={formData.remarks}
            onChange={(e) => setFormData({...formData, remarks: e.target.value})}
          ></textarea>
        </div>

        <button className="btn btn-primary" onClick={handleSave} style={{ alignSelf: 'flex-end' }}>
          <Save size={20} />
          保存する
        </button>
      </div>
    </div>
  );
};

const ListScreen = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('equipment-ledger') || '[]');
    setItems(data);
  }, []);

  return (
    <div className="container fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn" onClick={() => navigate('/')} style={{ padding: '8px' }}>
          <ChevronLeft size={24} />
        </button>
        <h2>設備台帳リスト</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Info size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <p>登録された設備はありません</p>
          </div>
        ) : (
          items.map(item => (
            <div 
              key={item.id} 
              className="glass-card" 
              onClick={() => navigate(`/detail/${item.id}`)}
              style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            >
              <div>
                <h3 style={{ margin: 0 }}>{item.name}</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {item.location || '場所未指定'}
                </p>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const DetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('equipment-ledger') || '[]');
    const found = data.find(d => String(d.id) === String(id));
    if (found) {
      setItem(found);
    }
  }, [id]);

  const handleDelete = (e) => {
    e.preventDefault();
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }
    
    // Execute deletion on second click
    try {
      const data = JSON.parse(localStorage.getItem('equipment-ledger') || '[]');
      const filtered = data.filter(d => String(d.id) !== String(id));
      localStorage.setItem('equipment-ledger', JSON.stringify(filtered));
      navigate('/list');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('削除に失敗しました');
      setIsDeleting(false);
    }
  };

  if (!item) return <div className="container">読み込み中...</div>;

  return (
    <div className="container fade-in">
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn" onClick={() => navigate('/list')} style={{ padding: '8px' }}>
            <ChevronLeft size={24} />
          </button>
          <h2>設備詳細</h2>
        </div>
        {isDeleting ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn" 
              onClick={() => setIsDeleting(false)} 
              style={{ padding: '8px 16px', background: '#f1f5f9' }}
            >
              キャンセル
            </button>
            <button 
              className="btn" 
              onClick={handleDelete} 
              style={{ 
                color: 'white', 
                background: 'var(--accent-red)', 
                padding: '8px 16px',
                fontWeight: 'bold'
              }}
            >
              削除確定
            </button>
          </div>
        ) : (
          <button 
            className="btn" 
            onClick={handleDelete} 
            style={{ 
              color: 'var(--accent-red)', 
              background: 'white', 
              border: '1px solid var(--accent-red)',
              padding: '8px 16px'
            }}
          >
            <Trash2 size={20} />
            <span>削除</span>
          </button>
        )}
      </div>

      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>{item.name}</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            <MapPin size={20} /> {item.location || '場所未指定'}
          </p>
        </div>

        {item.mapData && (
          <div style={{ border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderBottom: '1px solid #ddd', fontWeight: '600' }}>
              工場内設置場所
            </div>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '400/250' }}>
              <img 
                src={item.mapData} 
                alt="設置場所" 
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} 
              />
            </div>
          </div>
        )}

        {item.photos && item.photos.length > 0 && (
          <div>
            <div style={{ marginBottom: '1rem', fontWeight: '600' }}>設備写真</div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {item.photos.map((photo, i) => (
                <img 
                  key={i} 
                  src={photo} 
                  alt={`設備写真 ${i+1}`} 
                  style={{ width: 'calc(50% - 0.5rem)', height: '200px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #ddd' }} 
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <div style={{ marginBottom: '0.5rem', fontWeight: '600' }}>備考</div>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', minHeight: '100px', whiteSpace: 'pre-wrap' }}>
            {item.remarks || '備考なし'}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const MapCanvas = ({ onSave }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const isInitialized = useRef(false);

  // Background drawing logic
  const drawBackground = useCallback((ctx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Clear and fill base
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Drawing factory lines (dummy)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 100, 150);   // Area A
    ctx.strokeRect(140, 20, 220, 110);  // Area B
    ctx.strokeRect(20, 190, 340, 40);   // Area C
    
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Area A', 30, 40);
    ctx.fillText('Area B', 150, 40);
    ctx.fillText('Area C', 30, 215);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const render = () => {
      drawBackground(ctx);
      // If we had drawings to restore, we'd do it here
    };

    render();
    
    // Add resize listener just in case (though width/height are fixed)
    window.addEventListener('resize', render);
    return () => window.removeEventListener('resize', render);
  }, [drawBackground]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Get pointer position (Viewport relative)
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Relative to canvas top-left
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    // Map to internal coordinate space
    const x = offsetX * (canvas.width / rect.width);
    const y = offsetY * (canvas.height / rect.height);

    return { x, y };
  };

  const startDrawing = (e) => {
    if (e.cancelable) e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'red';
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      onSave(canvasRef.current.toDataURL());
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx);
    onSave(null);
  };

  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: '10px' }}>
      <canvas 
        ref={canvasRef}
        width={400}
        height={250}
        style={{ 
          width: '100%', 
          height: 'auto', 
          border: '1px solid #cbd5e1', 
          borderRadius: '12px', 
          cursor: 'crosshair', 
          touchAction: 'none',
          display: 'block'
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
      />
      <button 
        className="btn"
        type="button"
        style={{ 
          position: 'absolute', 
          top: '12px', 
          right: '12px', 
          fontSize: '13px', 
          padding: '6px 14px', 
          background: 'rgba(255, 255, 255, 0.95)', 
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 5,
          color: 'var(--text-main)'
        }}
        onClick={handleReset}
      >
        <span>リセット</span>
      </button>
    </div>
  );
};

const PhotoUpload = ({ onPhotosChange }) => {
  const [photos, setPhotos] = useState([]);

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 2) {
      alert('写真は最大2枚までです');
      return;
    }
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhotos = [...photos, event.target.result];
        setPhotos(newPhotos);
        onPhotosChange(newPhotos);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {photos.map((p, i) => (
        <div key={i} style={{ position: 'relative', width: '100px', height: '100px' }}>
          <img src={p} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} alt="設備写真" />
          <button 
            style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
            onClick={() => {
              const newPhotos = photos.filter((_, idx) => idx !== i);
              setPhotos(newPhotos);
              onPhotosChange(newPhotos);
            }}
          >
            ×
          </button>
        </div>
      ))}
      {photos.length < 2 && (
        <label style={{ width: '100px', height: '100px', border: '2px dashed #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <Camera size={24} />
          <span style={{ fontSize: '10px' }}>撮影/選択</span>
          <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFile} />
        </label>
      )}
    </div>
  );
};

// --- App ---

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TopScreen />} />
        <Route path="/create" element={<CreateScreen />} />
        <Route path="/list" element={<ListScreen />} />
        <Route path="/detail/:id" element={<DetailScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
