import React, { useState } from 'react';
import PageHeader from '../../../components/shared/Layout/PageHeader';

export const Library3DPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const libraryItems = [
    { id: '1', type: '360', title: 'Toàn cảnh Nhà thờ họ Nguyễn Đại Tôn', date: '12/08/2026', views: 245, thumb: '🏛️' },
    { id: '2', type: '3D', title: 'Mô hình Lăng Mộ Cụ Tổ', date: '01/09/2026', views: 180, thumb: '🗿' },
    { id: '3', type: '360', title: 'Nội điện Không gian Thờ', date: '10/09/2026', views: 320, thumb: '✨' },
  ];

  return (
    <div className="page-container h-full flex flex-col relative overflow-hidden">
      <PageHeader 
        title="Thư viện 3D / 360" 
        subtitle="Quản lý và xem các mô hình 3D, ảnh chụp panorama 360 độ của từ đường, lăng mộ."
      />
      
      <div className="flex-1 overflow-auto bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg text-sm">Tất cả (3)</button>
            <button className="px-4 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-lg text-sm">Tour 360</button>
            <button className="px-4 py-2 text-slate-600 hover:bg-slate-50 font-medium rounded-lg text-sm">Mô hình 3D</button>
          </div>
          <button className="btn-primary" onClick={() => setIsUploadModalOpen(true)}>+ Tải lên dữ liệu mới</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraryItems.map(item => (
            <div key={item.id} className="border border-slate-200 rounded-xl overflow-hidden group hover:shadow-lg transition bg-white flex flex-col">
              <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
                <span className="text-6xl group-hover:scale-110 transition-transform duration-500">{item.thumb}</span>
                <div className="absolute top-3 left-3 bg-slate-900/60 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                  {item.type === '360' ? 'PANORAMA 360' : 'MÔ HÌNH 3D'}
                </div>
                <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <button className="btn-primary flex items-center gap-2" onClick={() => setSelectedModel(item)}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                <div className="flex justify-between items-center mt-auto pt-3 text-sm text-slate-500">
                  <span>📅 {item.date}</span>
                  <span>👁️ {item.views} lượt xem</span>
                </div>
              </div>
            </div>
          ))}

          <div 
            className="border-2 border-slate-200 border-dashed rounded-xl flex items-center justify-center aspect-[4/3] flex-col text-slate-400 cursor-pointer hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <p className="font-bold">Tải lên dữ liệu mới</p>
            <p className="text-sm mt-1">Hỗ trợ định dạng: .obj, .gltf, .jpg 360</p>
          </div>
        </div>
      </div>

      {/* VR/3D Viewer Modal Mock */}
      {selectedModel && (
        <div className="fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-sm flex flex-col animate-fade-in">
          <div className="p-4 flex justify-between items-center text-white bg-black/30">
            <div>
              <h2 className="text-xl font-bold">{selectedModel.title}</h2>
              <p className="text-sm text-slate-300">Đang xem chế độ {selectedModel.type === '360' ? 'Panorama 360 độ' : 'Mô hình 3D tương tác'}</p>
            </div>
            <div className="flex gap-4">
              <button className="p-2 hover:bg-white/10 rounded-full transition" title="Toàn màn hình">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
              </button>
              <button className="p-2 hover:bg-white/10 rounded-full transition text-red-400" onClick={() => setSelectedModel(null)}>
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {/* Viewer Mock */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900"></div>
            
            <div className="z-10 text-center animate-pulse">
              <div className="text-9xl mb-8 drop-shadow-2xl">{selectedModel.thumb}</div>
              <p className="text-slate-300 text-lg font-medium tracking-widest uppercase">Mô phỏng không gian {selectedModel.type}</p>
              <p className="text-slate-500 mt-2">Sử dụng chuột để xoay và con lăn để thu phóng</p>
            </div>

            {/* Controls Mock */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 p-3 rounded-full backdrop-blur-md border border-white/10">
              <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition">↺</button>
              <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition">↕</button>
              <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition">↔</button>
              <div className="w-px h-8 bg-white/20 my-auto mx-2"></div>
              <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white font-bold transition">+</button>
              <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white font-bold transition">-</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Tải lên Dữ liệu 3D / 360</h3>
              <button className="text-slate-400 hover:text-slate-600" onClick={() => setIsUploadModalOpen(false)}>✕</button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Loại dữ liệu <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="dataType" defaultChecked className="text-blue-600" />
                    <span className="text-slate-700">Tour Panorama 360</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="dataType" className="text-blue-600" />
                    <span className="text-slate-700">Mô hình 3D (Object)</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề hiển thị <span className="text-red-500">*</span></label>
                <input type="text" className="form-input-admin w-full" placeholder="Ví dụ: Lăng mộ cụ tổ..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chọn Tệp tin (File) <span className="text-red-500">*</span></label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  </div>
                  <p className="text-slate-600 font-medium">Kéo thả file vào đây hoặc nhấn để chọn</p>
                  <p className="text-xs text-slate-400 mt-2">Dung lượng tối đa 100MB.</p>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setIsUploadModalOpen(false)}>Huỷ</button>
              <button className="btn-primary" onClick={() => { alert('Bắt đầu tải lên!'); setIsUploadModalOpen(false); }}>Tải lên dữ liệu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library3DPage;
