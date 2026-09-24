import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export const CaseCard = ({ data }) => {
  // Короткое описание под названием — берём из tags или style
  const subtitle =
    data.tags?.slice(0, 2).join(' и ') ||
    data.style ||
    'Стиль в каждой вещи'

  return (
    <Link
      to={`/case/${data.id}`}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#0d0d12] border border-white/[0.06] transition-all duration-500 hover:border-white/20 hover:bg-[#111117]"
    >
      {/* Витрина */}
<div className="relative aspect-[4/4.5] overflow-hidden bg-gradient-to-b from-[#15151c] to-[#0a0a0f]">        {/* Мягкое свечение сверху */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] rounded-full bg-white/[0.03] blur-[60px]" />

        {/* Картинка */}
        <img
          src={data.cover}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Затемнение снизу для плавного перехода */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0d0d12] to-transparent" />

        {/* Бейдж стиля (опционально, если есть) */}
        {data.badge === 'new' && (
          <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-bold tracking-[2px] uppercase text-white">
            New
          </div>
        )}
      </div>

      {/* Инфо */}
      <div className="p-6 flex flex-col flex-1">
        {/* Название */}
        <h3 className="text-base font-black tracking-[2px] uppercase text-white mb-2 line-clamp-1">
          {data.title}
        </h3>

        {/* Подзаголовок */}
        <p className="text-xs text-white/40 mb-6 line-clamp-2 leading-relaxed">
          {subtitle}
        </p>

        {/* Низ: цена + стрелка */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <div className="text-lg font-black text-white">
            {data.price?.toLocaleString('ru-RU')} ₽
          </div>

          <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center transition-all group-hover:bg-white group-hover:border-white group-hover:text-black text-white/60">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  )
}