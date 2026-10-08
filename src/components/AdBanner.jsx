import { useEffect, useRef } from "react";

export default function AdBanner() {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current) return;

    // Bersihkan jika component di-render ulang
    adRef.current.innerHTML = "";

    // Konfigurasi Adsterra
    window.atOptions = {
      key: "c11f8555adf924fecf124800dfa61e58",
      format: "iframe",
      height: 250,
      width: 300,
      params: {},
    };

    // Load script iklan
    const script = document.createElement("script");
    script.src =
      "https://bauval.org/22/c11f8555adf924fecf124800dfa61e58";
    script.async = true;

    adRef.current.appendChild(script);

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div
        ref={adRef}
        className="w-[300px] h-[250px] overflow-hidden"
      />
    </div>
  );
}