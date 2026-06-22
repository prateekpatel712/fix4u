/**
 * A phone frame with a looping muted video inside — used to show the AI agent
 * replying in a chat. Defaults to the WhatsApp confirmed-booking clip.
 */
export default function PhoneMockup({ src = "/vision.mp4" }: { src?: string }) {
  return (
    <div className="relative w-[180px] xl:w-[208px] aspect-[9/19] rounded-[2.2rem] bg-ink p-[5px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.55)] ring-1 ring-black/30 select-none">
      <div className="relative w-full h-full rounded-[1.85rem] overflow-hidden bg-black">
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-ink rounded-full z-20" />
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>
    </div>
  );
}
