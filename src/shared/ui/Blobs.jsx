export const Blobs = () => {
  return (
    <>
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Верхнее свечение — синее */}
        <div className="absolute w-[800px] h-[800px] rounded-full bg-blue-500/[0.07] blur-[200px] -top-[300px] -right-[200px]" />
        {/* Нижнее свечение — тоже синее, чуть темнее */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-600/[0.05] blur-[180px] bottom-[10%] -left-[200px]" />
      </div>

      {/* Тонкая сетка */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        }}
      />
    </>
  )
}