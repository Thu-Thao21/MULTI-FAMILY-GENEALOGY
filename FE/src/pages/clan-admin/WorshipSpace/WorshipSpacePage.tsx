import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';

export const WorshipSpacePage: React.FC = () => {
  const [isWorshipMode, setIsWorshipMode] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleAction = (action: string) => {
    setActiveAction(action);
    setTimeout(() => {
      setActiveAction(null);
    }, 3000);
  };

  const headerActions = (
    <button className="btn-primary bg-yellow-600 hover:bg-yellow-700 border-yellow-600">
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
      Đăng ký Gói Premium
    </button>
  );

  return (
    <div className="page-container h-full flex flex-col relative overflow-hidden">
      <PageHeader 
        title="Phòng Thờ Số (Digital Worship Space)" 
        subtitle="Không gian tâm linh kỹ thuật số giúp con cháu phương xa thắp hương, dâng lễ trực tuyến."
        actions={headerActions}
      />
      
      {!isWorshipMode ? (
        <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13M10 10h4v4h-4v-4z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Không gian Thờ cúng 3D Interactive</h2>
          <p className="text-lg text-slate-500 max-w-2xl mb-8">
            Tính năng này cho phép giả lập một không gian từ đường 3D, nơi các thành viên có thể thực hiện nghi thức tâm linh, đọc văn khấn, thắp nhang ảo và nghe kinh/nhạc thiền.
          </p>
          <button className="btn-primary text-lg px-8 py-3 bg-yellow-600 hover:bg-yellow-700 border-yellow-600 shadow-lg shadow-yellow-600/20" onClick={() => setIsWorshipMode(true)}>
            Mở giao diện Phòng thờ ảo
          </button>
        </div>
      ) : (
        <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden relative flex flex-col shadow-2xl animate-fade-in border border-slate-800">
          {/* Header of Room */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
            <div className="text-white">
              <h3 className="font-bold text-lg text-yellow-500">Từ Đường Nguyễn Đại Tôn</h3>
              <p className="text-xs text-slate-300">Đang có 12 người trực tuyến dâng hương</p>
            </div>
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded backdrop-blur-md text-sm font-medium transition" onClick={() => setIsWorshipMode(false)}>
              Thoát phòng thờ
            </button>
          </div>

          {/* Main 3D Scene Mock */}
          <div className="flex-1 relative flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black">
            
            {/* Altar Mock */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Hoành phi */}
              <div className="w-64 h-16 bg-red-900 border-4 border-yellow-600 flex items-center justify-center mb-8 shadow-2xl">
                <span className="text-yellow-500 font-serif text-2xl font-bold tracking-widest">德 流 光</span>
              </div>
              
              {/* Bàn thờ */}
              <div className="w-96 h-48 bg-gradient-to-b from-amber-900 to-amber-950 border-t-8 border-amber-800 rounded-t shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative flex items-end justify-center pb-4 gap-6">
                
                {/* Lư hương */}
                <div className="w-16 h-12 bg-yellow-600 rounded-b-xl rounded-t flex items-start justify-center relative shadow-lg">
                  <div className="w-12 h-2 bg-yellow-500 rounded-full mt-[-4px]"></div>
                  {/* Nhang */}
                  {activeAction === 'incense' && (
                    <div className="absolute -top-16 flex gap-1 animate-fade-in">
                      <div className="w-1 h-16 bg-red-500 rounded-t shadow-[0_0_10px_red]"></div>
                      <div className="w-1 h-14 bg-red-500 rounded-t shadow-[0_0_10px_red] mt-2"></div>
                      <div className="w-1 h-16 bg-red-500 rounded-t shadow-[0_0_10px_red]"></div>
                      {/* Khói */}
                      <div className="absolute -top-12 -left-4 text-white/50 text-4xl animate-bounce">🌫️</div>
                    </div>
                  )}
                </div>

                {/* Trái cây */}
                <div className="w-20 h-10 bg-red-800 rounded-full flex items-center justify-center absolute left-8 bottom-6 shadow-lg">
                  {activeAction === 'fruit' && <span className="absolute -top-8 text-3xl animate-bounce">🍎🍊🍌</span>}
                </div>

                {/* Hoa */}
                <div className="w-8 h-16 bg-blue-900 rounded-b absolute right-12 bottom-6 shadow-lg flex items-end justify-center">
                  {activeAction === 'flower' && <span className="absolute -top-12 text-4xl animate-bounce">💐</span>}
                </div>

                {/* Đèn cầy */}
                <div className="w-4 h-12 bg-red-600 absolute left-4 bottom-8 rounded shadow-lg flex justify-center">
                  <div className="w-2 h-4 bg-yellow-300 rounded-full -mt-2 shadow-[0_0_15px_yellow] animate-pulse"></div>
                </div>
                <div className="w-4 h-12 bg-red-600 absolute right-4 bottom-8 rounded shadow-lg flex justify-center">
                  <div className="w-2 h-4 bg-yellow-300 rounded-full -mt-2 shadow-[0_0_15px_yellow] animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Notification */}
            {activeAction && (
              <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-yellow-900/80 border border-yellow-600 text-yellow-100 px-6 py-2 rounded-full backdrop-blur-md animate-fade-in font-medium shadow-xl">
                {activeAction === 'incense' && 'Bạn đã dâng 3 nén nhang thành tâm.'}
                {activeAction === 'flower' && 'Bạn đã dâng lẵng hoa tươi.'}
                {activeAction === 'fruit' && 'Bạn đã dâng mâm ngũ quả.'}
                {activeAction === 'pray' && 'Bạn đang đọc văn khấn...'}
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl flex gap-2 z-20 shadow-2xl">
            <button 
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition w-24 ${activeAction === 'incense' ? 'bg-yellow-600/40 text-yellow-300' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
              onClick={() => handleAction('incense')}
            >
              <span className="text-2xl">🥢</span>
              <span className="text-xs font-medium">Thắp hương</span>
            </button>
            <button 
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition w-24 ${activeAction === 'flower' ? 'bg-yellow-600/40 text-yellow-300' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
              onClick={() => handleAction('flower')}
            >
              <span className="text-2xl">💐</span>
              <span className="text-xs font-medium">Dâng hoa</span>
            </button>
            <button 
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition w-24 ${activeAction === 'fruit' ? 'bg-yellow-600/40 text-yellow-300' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
              onClick={() => handleAction('fruit')}
            >
              <span className="text-2xl">🍎</span>
              <span className="text-xs font-medium">Dâng quả</span>
            </button>
            <div className="w-px bg-white/20 my-2"></div>
            <button 
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition w-24 ${activeAction === 'pray' ? 'bg-yellow-600/40 text-yellow-300' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
              onClick={() => handleAction('pray')}
            >
              <span className="text-2xl">🙏</span>
              <span className="text-xs font-medium">Khấn vái</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorshipSpacePage;
