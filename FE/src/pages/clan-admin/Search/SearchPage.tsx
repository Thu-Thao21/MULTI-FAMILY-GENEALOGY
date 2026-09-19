import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';

export const SearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'finder' | 'path'>('finder');
  const [showResult, setShowResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [showPathResult, setShowPathResult] = useState(false);
  const [isCalculatingPath, setIsCalculatingPath] = useState(false);

  const handleAnalyze = () => {
    setIsCalculating(true);
    setShowResult(false);
    setTimeout(() => {
      setIsCalculating(false);
      setShowResult(true);
    }, 800);
  };

  const handleFindPath = () => {
    setIsCalculatingPath(true);
    setShowPathResult(false);
    setTimeout(() => {
      setIsCalculatingPath(false);
      setShowPathResult(true);
    }, 1000);
  };

  return (
    <div className="page-container h-full flex flex-col relative overflow-hidden">
      <PageHeader 
        title="Tra cứu & Xưng hô" 
        subtitle="Xác định quan hệ giữa hai người, tìm đường quan hệ và tính toán cách xưng hô tự động."
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button 
            className={`px-6 py-4 font-semibold text-sm ${activeTab === 'finder' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('finder')}
          >
            Tính Quan hệ / Xưng hô
          </button>
          <button 
            className={`px-6 py-4 font-semibold text-sm ${activeTab === 'path' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setActiveTab('path')}
          >
            Tìm đường đi quan hệ
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8 flex-1 overflow-auto">
          {activeTab === 'finder' && (
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 w-full bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Người thứ nhất (A)</label>
                  <input type="text" placeholder="Nhập tên hoặc ID..." defaultValue="Nguyễn Văn A" className="form-input-admin w-full p-3 bg-white" />
                </div>
                
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 shadow-sm border border-blue-200">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                </div>

                <div className="flex-1 w-full bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Người thứ hai (B)</label>
                  <input type="text" placeholder="Nhập tên hoặc ID..." defaultValue="Nguyễn Văn B" className="form-input-admin w-full p-3 bg-white" />
                </div>
              </div>

              <div className="mt-8 text-center">
                <button 
                  className="btn-primary px-8 py-3 text-lg" 
                  onClick={handleAnalyze}
                  disabled={isCalculating}
                >
                  {isCalculating ? 'Đang phân tích dữ liệu...' : 'Phân tích Xưng hô'}
                </button>
              </div>

              {showResult && (
                <div className="mt-12 p-8 bg-blue-50 border border-blue-200 rounded-xl text-center shadow-sm animate-fade-in">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Kết quả phân tích</h3>
                  <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <div className="text-slate-500 mb-2">A gọi B là</div>
                      <div className="text-2xl font-bold text-blue-600">Chú họ</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <div className="text-slate-500 mb-2">B gọi A là</div>
                      <div className="text-2xl font-bold text-blue-600">Cháu họ</div>
                    </div>
                  </div>
                  <p className="text-slate-500 mt-6 text-sm">Khoảng cách: 2 đời (Tính từ Cụ Cố chung)</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'path' && (
            <div className="max-w-4xl mx-auto py-4">
              <div className="flex gap-4 mb-8">
                <input type="text" placeholder="Người A..." defaultValue="Nguyễn Văn A" className="form-input-admin flex-1" />
                <input type="text" placeholder="Người B..." defaultValue="Nguyễn Văn B" className="form-input-admin flex-1" />
                <button className="btn-primary" onClick={handleFindPath} disabled={isCalculatingPath}>
                  {isCalculatingPath ? 'Đang tìm...' : 'Tìm đường'}
                </button>
              </div>

              {!showPathResult && !isCalculatingPath && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Biểu đồ đường đi</h3>
                  <p className="text-slate-500">Nhập hai người dùng để vẽ biểu đồ cây liên kết trực tiếp giữa họ.</p>
                </div>
              )}

              {showPathResult && (
                <div className="animate-fade-in text-center p-8 border border-slate-200 rounded-xl bg-slate-50">
                  <h4 className="font-bold text-slate-800 mb-8">Tổ tiên chung gần nhất: Nguyễn Trọng X</h4>
                  <div className="flex flex-col items-center gap-4 relative">
                    {/* Node Cụ chung */}
                    <div className="bg-white border-2 border-orange-400 p-3 rounded-lg shadow-sm z-10 w-48 font-bold text-slate-800">
                      Nguyễn Trọng X (Cụ chung)
                    </div>
                    
                    {/* Paths */}
                    <div className="flex w-full justify-center gap-32">
                      {/* Left Path */}
                      <div className="flex flex-col items-center gap-4 relative">
                        <div className="absolute top-0 right-1/2 w-[2px] h-8 bg-slate-300 -mt-6 -mr-[1px]"></div>
                        <div className="absolute top-[-24px] right-[-64px] w-32 h-[2px] bg-slate-300"></div>
                        
                        <div className="bg-white border border-slate-300 p-2 rounded-lg w-40 text-sm">Ông Nguyễn Trọng Y</div>
                        <div className="w-[2px] h-4 bg-slate-300"></div>
                        <div className="bg-white border border-slate-300 p-2 rounded-lg w-40 text-sm">Ông Nguyễn Văn Z</div>
                        <div className="w-[2px] h-4 bg-slate-300"></div>
                        <div className="bg-white border-2 border-blue-500 p-3 rounded-lg w-48 font-bold text-blue-700">Nguyễn Văn A</div>
                      </div>

                      {/* Right Path */}
                      <div className="flex flex-col items-center gap-4 relative">
                        <div className="absolute top-0 left-1/2 w-[2px] h-8 bg-slate-300 -mt-6 -ml-[1px]"></div>
                        <div className="absolute top-[-24px] left-[-64px] w-32 h-[2px] bg-slate-300"></div>

                        <div className="bg-white border border-slate-300 p-2 rounded-lg w-40 text-sm">Ông Nguyễn Văn W</div>
                        <div className="w-[2px] h-4 bg-slate-300"></div>
                        <div className="bg-white border-2 border-blue-500 p-3 rounded-lg w-48 font-bold text-blue-700">Nguyễn Văn B</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
