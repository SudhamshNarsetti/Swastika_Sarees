import React, { useState, useRef, useEffect } from 'react';
import { X, Crop, Move, Sparkles, AlertTriangle } from 'lucide-react';

export default function ImageCropperModal({ imageUrl, onClose, onSave, isSaving }) {
  const [aspectRatio, setAspectRatio] = useState('2/3'); // '2/3', '3/4', or 'free'
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Crop box coordinates in percentages (0 to 100)
  const [crop, setCrop] = useState({ left: 10, top: 10, width: 60, height: 90 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, left: 0, top: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 });

  // Update crop box size when aspect ratio changes
  useEffect(() => {
    if (aspectRatio === 'free') return;
    
    const ratio = aspectRatio === '2/3' ? 2 / 3 : 3 / 4;
    setCrop(prev => {
      let w = prev.width;
      let h = w / ratio;
      
      // If height overflows, scale down width
      if (prev.top + h > 100) {
        h = 100 - prev.top;
        w = h * ratio;
      }
      // If width overflows, scale down height
      if (prev.left + w > 100) {
        w = 100 - prev.left;
        h = w / ratio;
      }
      
      return {
        ...prev,
        width: Math.max(10, w),
        height: Math.max(10, h)
      };
    });
  }, [aspectRatio]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.resize-handle')) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      left: crop.left,
      top: crop.top
    };
  };

  const handleResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: crop.width,
      height: crop.height,
      left: crop.left,
      top: crop.top
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const widthPx = rect.width;
      const heightPx = rect.height;

      if (isDragging) {
        const dxPercent = ((e.clientX - dragStart.current.x) / widthPx) * 100;
        const dyPercent = ((e.clientY - dragStart.current.y) / heightPx) * 100;

        let newLeft = dragStart.current.left + dxPercent;
        let newTop = dragStart.current.top + dyPercent;

        // Clamping to boundaries
        newLeft = Math.max(0, Math.min(100 - crop.width, newLeft));
        newTop = Math.max(0, Math.min(100 - crop.height, newTop));

        setCrop(prev => ({
          ...prev,
          left: newLeft,
          top: newTop
        }));
      }

      if (isResizing) {
        const dxPercent = ((e.clientX - resizeStart.current.x) / widthPx) * 100;
        const dyPercent = ((e.clientY - resizeStart.current.y) / heightPx) * 100;

        if (aspectRatio === 'free') {
          const newWidth = Math.max(10, Math.min(100 - resizeStart.current.left, resizeStart.current.width + dxPercent));
          const newHeight = Math.max(10, Math.min(100 - resizeStart.current.top, resizeStart.current.height + dyPercent));
          setCrop(prev => ({
            ...prev,
            width: newWidth,
            height: newHeight
          }));
        } else {
          const ratio = aspectRatio === '2/3' ? 2 / 3 : 3 / 4;
          // Use the larger coordinate change as driver
          let newWidth = resizeStart.current.width + dxPercent;
          let newHeight = newWidth / ratio;

          // Clamping to container boundaries
          if (resizeStart.current.left + newWidth > 100) {
            newWidth = 100 - resizeStart.current.left;
            newHeight = newWidth / ratio;
          }
          if (resizeStart.current.top + newHeight > 100) {
            newHeight = 100 - resizeStart.current.top;
            newWidth = newHeight * ratio;
          }

          setCrop(prev => ({
            ...prev,
            width: Math.max(10, newWidth),
            height: Math.max(10, newHeight)
          }));
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, crop, aspectRatio]);

  const handleApplyCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    // Use native image sizes for high resolution crop
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    const cropX = (crop.left / 100) * naturalWidth;
    const cropY = (crop.top / 100) * naturalHeight;
    const cropW = (crop.width / 100) * naturalWidth;
    const cropH = (crop.height / 100) * naturalHeight;

    const canvas = document.createElement('canvas');
    canvas.width = cropW;
    canvas.height = cropH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw selection to canvas
    const sourceImg = new Image();
    sourceImg.crossOrigin = 'anonymous'; // Prevent CORS taint
    sourceImg.onload = () => {
      ctx.drawImage(sourceImg, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      canvas.toBlob((blob) => {
        if (blob) {
          onSave(blob);
        }
      }, 'image/jpeg', 0.95);
    };
    sourceImg.onerror = () => {
      alert('Failed to load image for canvas cropping. CORS settings might be blocking manual canvas edits.');
    };
    sourceImg.src = imageUrl;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 select-none font-sans text-xs">
      <div className="bg-brand-white border border-brand-border max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border/60 bg-brand-cream/15">
          <div className="flex items-center space-x-2 text-brand-dark">
            <Crop size={16} className="text-brand-gold animate-pulse" />
            <span className="font-display font-bold text-sm tracking-wide uppercase">Manual Crop Image Editor</span>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-full text-brand-muted hover:text-brand-dark hover:bg-black/5 transition-colors"
            disabled={isSaving}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-6 bg-brand-cream/5 flex flex-col items-center justify-center min-h-[350px] relative">
          
          {/* Main Cropping Window */}
          <div 
            ref={containerRef}
            className="relative border border-brand-border/40 max-h-[50vh] max-w-full overflow-hidden select-none bg-black/5"
            style={{ display: 'inline-block' }}
          >
            <img 
              ref={imageRef}
              src={imageUrl} 
              alt="Source Crop"
              className="max-h-[50vh] max-w-full h-auto object-contain pointer-events-none"
              crossOrigin="anonymous"
            />

            {/* Top Shadow */}
            <div 
              className="absolute left-0 right-0 top-0 bg-black/65 pointer-events-none"
              style={{ height: `${crop.top}%` }}
            />
            {/* Bottom Shadow */}
            <div 
              className="absolute left-0 right-0 bottom-0 bg-black/65 pointer-events-none"
              style={{ top: `${crop.top + crop.height}%` }}
            />
            {/* Left Shadow */}
            <div 
              className="absolute left-0 bg-black/65 pointer-events-none"
              style={{ top: `${crop.top}%`, height: `${crop.height}%`, width: `${crop.left}%` }}
            />
            {/* Right Shadow */}
            <div 
              className="absolute right-0 bg-black/65 pointer-events-none"
              style={{ top: `${crop.top}%`, height: `${crop.height}%`, left: `${crop.left + crop.width}%` }}
            />

            {/* Draggable Crop Box Window */}
            <div 
              className="absolute border-2 border-brand-gold shadow-[0_0_0_1px_rgba(255,255,255,0.4)] cursor-move"
              style={{ 
                left: `${crop.left}%`, 
                top: `${crop.top}%`, 
                width: `${crop.width}%`, 
                height: `${crop.height}%` 
              }}
              onMouseDown={handleMouseDown}
            >
              {/* Inside Grid Lines for Premium Look */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30 pointer-events-none">
                <div className="border-r border-dashed border-white"></div>
                <div className="border-r border-dashed border-white"></div>
                <div></div>
                <div className="border-b border-dashed border-white col-span-3"></div>
                <div className="border-b border-dashed border-white col-span-3"></div>
              </div>

              {/* Drag Handle Label */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                <Move size={12} />
              </div>

              {/* Resize Handle (Bottom-Right) */}
              <div 
                className="resize-handle absolute bottom-[-4px] right-[-4px] w-4 h-4 bg-brand-gold border border-white rounded-full shadow-md cursor-se-resize flex items-center justify-center hover:scale-125 transition-transform"
                onMouseDown={handleResizeMouseDown}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Control Footer */}
        <div className="px-6 py-4 border-t border-brand-border/60 bg-brand-cream/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Aspect Ratio Options */}
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-brand-dark uppercase tracking-wider text-[10px]">Aspect Ratio:</span>
            <div className="flex bg-brand-cream border border-brand-border/80 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setAspectRatio('2/3')}
                className={`px-3 py-1.5 rounded-md font-semibold text-[10px] uppercase transition-all ${
                  aspectRatio === '2/3' 
                    ? 'bg-brand-crimson text-brand-cream shadow-sm' 
                    : 'text-brand-muted hover:text-brand-dark'
                }`}
              >
                2:3 Product
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('3/4')}
                className={`px-3 py-1.5 rounded-md font-semibold text-[10px] uppercase transition-all ${
                  aspectRatio === '3/4' 
                    ? 'bg-brand-crimson text-brand-cream shadow-sm' 
                    : 'text-brand-muted hover:text-brand-dark'
                }`}
              >
                3:4 Category
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('free')}
                className={`px-3 py-1.5 rounded-md font-semibold text-[10px] uppercase transition-all ${
                  aspectRatio === 'free' 
                    ? 'bg-brand-crimson text-brand-cream shadow-sm' 
                    : 'text-brand-muted hover:text-brand-dark'
                }`}
              >
                Freeform
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-brand-border text-brand-dark bg-brand-white hover:bg-brand-cream font-semibold transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              disabled={isSaving}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-brand-crimson hover:bg-brand-muted text-brand-cream font-semibold transition-colors shadow-md border border-brand-gold/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-brand-cream border-t-transparent rounded-full animate-spin" />
                  <span>Cropping & Uploading...</span>
                </>
              ) : (
                <>
                  <Crop size={14} />
                  <span>Save Crop</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
