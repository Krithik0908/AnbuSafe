import { useEffect, useState } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isClicking, setIsClicking] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        let trailCount = 0;
        const maxTrails = 30; // Increased for longer trail

        const updatePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Create multiple trail particles for glittery effect
            if (trailCount < maxTrails) {
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        const trail = document.createElement('div');
                        trail.className = 'cursor-trail';
                        const offsetX = (Math.random() - 0.5) * 10;
                        const offsetY = (Math.random() - 0.5) * 10;
                        trail.style.left = (e.clientX + offsetX) + 'px';
                        trail.style.top = (e.clientY + offsetY) + 'px';
                        document.body.appendChild(trail);

                        setTimeout(() => {
                            trail.remove();
                            trailCount--;
                        }, 1200);

                        trailCount++;
                    }, i * 20);
                }
            }
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        const handleMouseOver = (e) => {
            const target = e.target;
            if (
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.tagName === 'INPUT' ||
                target.classList.contains('clickable')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updatePosition);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <div
            className={`custom-cursor ${isClicking ? 'clicking' : ''} ${isHovering ? 'hovering' : ''}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)'
            }}
        />
    );
}
