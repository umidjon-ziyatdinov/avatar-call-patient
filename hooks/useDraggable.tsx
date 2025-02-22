import { useCallback, useEffect, useState } from "react";


interface Position {
    x: number;
    y: number;
  }

export const useDraggable = (containerRef: React.RefObject<HTMLDivElement>, videoBoxRef: React.RefObject<HTMLDivElement>) => {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  
    const handleDragStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
      setIsDragging(true);
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      setDragStart({
        x: clientX - position.x,
        y: clientY - position.y,
      });
    }, [position]);
  
    const handleDrag = useCallback((e: TouchEvent | MouseEvent) => {
      if (!isDragging || !containerRef.current || !videoBoxRef.current) return;
  
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
  
      const containerRect = containerRef.current.getBoundingClientRect();
      const videoBoxRect = videoBoxRef.current.getBoundingClientRect();
  
      const newX = clientX - dragStart.x;
      const newY = clientY - dragStart.y;
  
      const maxX = containerRect.width - videoBoxRect.width;
      const maxY = containerRect.height - videoBoxRect.height;
  
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }, [isDragging, dragStart, containerRef, videoBoxRef]);
  
    const handleDragEnd = useCallback(() => {
      setIsDragging(false);
    }, []);
  
    useEffect(() => {
      if (isDragging) {
        window.addEventListener("mousemove", handleDrag);
        window.addEventListener("mouseup", handleDragEnd);
        window.addEventListener("touchmove", handleDrag);
        window.addEventListener("touchend", handleDragEnd);
      }
  
      return () => {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchmove", handleDrag);
        window.removeEventListener("touchend", handleDragEnd);
      };
    }, [isDragging, handleDrag, handleDragEnd]);
  
    return {
      position,
      handleDragStart
    };
  };
  