import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as Dialog from "@/components/ui/dialog";
import { Crop, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onUpload: (processedImageBlob: Blob) => Promise<void>;
  fieldType: 'logo' | 'coverPhoto';
  isUploading: boolean;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onUpload,
  fieldType,
  isUploading
}) => {
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [cropArea, setCropArea] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'resize-se' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0, cropWidth: 0, cropHeight: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  const handleCropStart = (e: React.MouseEvent, type: 'move' | 'resize-se') => {
    if (!cropContainerRef.current) return;
    e.stopPropagation();
    
    const rect = cropContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setIsDragging(true);
    setDragType(type);
    setDragStart({ 
      x, y, 
      cropX: cropArea.x, 
      cropY: cropArea.y, 
      cropWidth: cropArea.width, 
      cropHeight: cropArea.height 
    });
  };

  const handleCropMove = (e: React.MouseEvent) => {
    if (!isDragging || !cropContainerRef.current) return;
    
    const rect = cropContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;
    
    if (dragType === 'move') {
      setCropArea({
        x: Math.max(0, Math.min(100 - dragStart.cropWidth, dragStart.cropX + deltaX)),
        y: Math.max(0, Math.min(100 - dragStart.cropHeight, dragStart.cropY + deltaY)),
        width: dragStart.cropWidth,
        height: dragStart.cropHeight
      });
    } else if (dragType === 'resize-se') {
      const newWidth = Math.max(10, Math.min(100 - dragStart.cropX, dragStart.cropWidth + deltaX));
      const newHeight = Math.max(10, Math.min(100 - dragStart.cropY, dragStart.cropHeight + deltaY));
      
      setCropArea({
        x: dragStart.cropX,
        y: dragStart.cropY,
        width: newWidth,
        height: newHeight
      });
    }
  };

  const handleCropEnd = () => {
    setIsDragging(false);
    setDragType(null);
  };

  const resetCrop = () => {
    setCropArea({ x: 10, y: 10, width: 80, height: 80 });
  };

  const resetAll = () => {
    setImageScale(1);
    setImageRotation(0);
    setCropArea({ x: 10, y: 10, width: 80, height: 80 });
  };

  const processAndUpload = async () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions based on field type
    const dimensions = fieldType === 'logo' ? { width: 400, height: 400 } : { width: 1200, height: 400 };
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context state
    ctx.save();
    
    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((imageRotation * Math.PI) / 180);
    ctx.scale(imageScale, imageScale);
    
    // Calculate crop dimensions as percentage of original image
    const cropX = (cropArea.x / 100) * img.naturalWidth;
    const cropY = (cropArea.y / 100) * img.naturalHeight;
    const cropWidth = (cropArea.width / 100) * img.naturalWidth;
    const cropHeight = (cropArea.height / 100) * img.naturalHeight;
    
    // Draw cropped image centered
    const drawWidth = fieldType === 'logo' ? 400 : 1200;
    const drawHeight = fieldType === 'logo' ? 400 : 400;
    ctx.drawImage(
      img, 
      cropX, cropY, cropWidth, cropHeight,
      -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight
    );
    
    // Restore context
    ctx.restore();
    
    // Convert canvas to blob and upload
    canvas.toBlob(async (blob) => {
      if (blob) {
        await onUpload(blob);
        resetAll();
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <Dialog.Dialog open={isOpen} onOpenChange={onClose}>
      <Dialog.DialogContent className="max-w-4xl">
        <Dialog.DialogHeader>
          <Dialog.DialogTitle className="flex items-center space-x-2">
            <Crop className="h-5 w-5" />
            <span>Edit {fieldType === 'logo' ? 'Logo' : 'Cover Photo'}</span>
          </Dialog.DialogTitle>
        </Dialog.DialogHeader>
        
        <div className="space-y-6">
          <div 
            ref={cropContainerRef}
            className="relative bg-muted rounded-lg overflow-hidden select-none" 
            style={{ aspectRatio: fieldType === 'logo' ? '1:1' : '3:1' }}
            onMouseMove={handleCropMove}
            onMouseUp={handleCropEnd}
            onMouseLeave={handleCropEnd}
          >
            <img 
              ref={imageRef}
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-contain"
              style={{
                transform: `scale(${imageScale}) rotate(${imageRotation}deg)`,
                transition: 'transform 0.2s ease'
              }}
            />
            
            {/* Crop overlay with interactive border */}
            <div 
              className="absolute border-2 border-blue-500 bg-blue-500/20 cursor-move"
              style={{
                left: `${cropArea.x}%`,
                top: `${cropArea.y}%`,
                width: `${cropArea.width}%`,
                height: `${cropArea.height}%`
              }}
              onMouseDown={(e) => handleCropStart(e, 'move')}
            >
              {/* Resize handle at bottom-right corner */}
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
                onMouseDown={(e) => handleCropStart(e, 'resize-se')}
              ></div>
              
              {/* Corner indicators */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-white border border-blue-500"></div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-white border border-blue-500"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-white border border-blue-500"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-white border border-blue-500"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Scale</Label>
              <div className="flex items-center gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setImageScale(Math.max(0.5, imageScale - 0.1))}
                  disabled={imageScale <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-mono w-16 text-center">
                  {Math.round(imageScale * 100)}%
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setImageScale(Math.min(3, imageScale + 0.1))}
                  disabled={imageScale >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Rotation</Label>
              <div className="flex items-center space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImageRotation(prev => prev - 90)}
                >
                  <RotateCw className="h-4 w-4 rotate-180" />
                </Button>
                <span className="text-sm font-medium">{imageRotation}°</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImageRotation(prev => prev + 90)}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Crop Area</Label>
              <div className="flex flex-col space-y-2 mt-2">
                <div className="text-xs text-muted-foreground">
                  Drag border to move, corner to resize
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetCrop}
                >
                  <Crop className="h-4 w-4 mr-2" />
                  Reset Crop
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={processAndUpload} disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          </div>
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
};
