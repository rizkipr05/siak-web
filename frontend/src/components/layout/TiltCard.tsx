import { useEffect, useRef } from "react";
import VanillaTilt from "vanilla-tilt";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function TiltCard({ children, className }: Props) {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tiltRef.current) {
      VanillaTilt.init(tiltRef.current, {
        max: 15,
        speed: 300,
        glare: true,
        "max-glare": 0.3,
      });
    }
  }, []);

  return (
    <div ref={tiltRef} className={className}>
      {children}
    </div>
  );
}
