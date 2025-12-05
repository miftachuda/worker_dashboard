// @ts-nocheck
import CardVib from "./CardVib";
import { useRef, useEffect } from "react";

export default function Iterator({ vibdata, refreshcallback }) {
  const scrollRef = useRef(null);
  const hasData = Array.isArray(vibdata) && vibdata.length > 0;
  // convert vertical scroll → horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY; // scroll horizontally
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex flex-row overflow-x-auto overflow-y-hidden gap-4 p-4 scroll-smooth"
    >
      {hasData ? (
        vibdata.map((element, i) => (
          <CardVib
            data={element}
            maindata={vibdata}
            key={element.id}
            i={i}
            refreshcallback={refreshcallback}
          />
        ))
      ) : (
        <div className="w-screen pt-40 pb-56 text-blue-300 text-4xl text-center bg-slate-900">
          <p>🙄🙄🙄🙄</p>
          <p>No Record Found</p>
        </div>
      )}
    </div>
  );
}
