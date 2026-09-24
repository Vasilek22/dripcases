import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Upload } from 'lucide-react'
import { STYLES, RARITY_OPTIONS } from '../../../entities/item/styles'
import { useAuth } from '../../auth/useAuth'
import { isAdmin } from '../../../config/admins'

const emptyItem = () => ({
  id: `item-${Date.now()}-${Math.random()}`,
  name: '',
  description: '',
  price: 0,
  rarity: 'common',
  imageUrl: '',
})

export const CreateCaseModal = ({ open, onClose, onCreate }) => {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [style, setStyle] = useState(STYLES[0])
  const [price, setPrice] = useState('')
  const [cover, setCover] = useState('')
  const [tags, setTags] = useState('')
  const [items, setItems] = useState([emptyItem(), emptyItem(), emptyItem()])
  const [error, setError] = useState('')

  // Сброс при открытии
  useEffect(() => {
    if (open) {
      setTitle('')
      setStyle(STYLES[0])
      setPrice('')
      setCover('')
      setTags('')
      setItems([emptyItem(), emptyItem(), emptyItem()])
      setError('')
    }
  }, [open])

  // Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  // Загрузка картинки в Base64 (простой способ без Storage)
  const handleFileUpload = (e, callback) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 500 * 1024) {
      setError('Картинка больше 500 КБ — сожми на squoosh.app')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => callback(ev.target.result)
    reader.readAsDataURL(file)
  }

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    )
  }

  const addItem = () => setItems((prev) => [...prev, emptyItem()])

  const removeItem = (index) =>
    setItems((prev) => prev.filter((_, i) => i !== index))

  const handleSubmit = () => {
    setError('')

    if (!title.trim()) return setError('Введи название кейса')
    if (!cover) return setError('Загрузи обложку кейса')
    if (!price || Number(price) <= 0) return setError('Укажи цену кейса')
    if (items.length < 2) return setError('Нужно минимум 2 вещи в кейсе')

    const validItems = items.filter((i) => i.name.trim() && i.imageUrl)
    if (validItems.length < 2) {
      return setError('Заполни хотя бы 2 вещи: название + картинка')
    }

    const newCase = {
      title: title.trim(),
      author: user?.displayName ? `@${user.displayName.split(' ')[0]}` : '@you',
      authorId: user?.uid || null, 
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      style,
      price: Number(price),
      cover,
      items: validItems,
    }

    onCreate(newCase)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-5 bg-black/80 backdrop-blur-2xl overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-in w-full max-w-2xl bg-[#101018]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 relative shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-500/30 hover:rotate-90 transition-all"
        >
          <X size={16} />
        </button>

        <h2 className="text-2xl font-black mb-1">Создать кейс</h2>
        <p className="text-sm text-white/50 mb-6">
          Заполни данные и добавь вещи — кейс появится на главной
        </p>

        {/* Название */}
        <div className="mb-4">
          <label className="text-xs uppercase tracking-wider font-bold text-white/60 mb-2 block">
            Название кейса
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Street-косуха + карго"
            maxLength={50}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/60 focus:outline-none text-sm text-white placeholder-white/30 transition-all"
          />
        </div>

        {/* Стиль + цена */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-white/60 mb-2 block">
              Стиль
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/60 focus:outline-none text-sm text-white transition-all cursor-pointer"
            >
              {STYLES.map((s) => (
                <option key={s} value={s} className="bg-[#101018]">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider font-bold text-white/60 mb-2 block">
              Цена кейса (₽)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="1500"
              min={1}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/60 focus:outline-none text-sm text-white placeholder-white/30 transition-all"
            />
          </div>
        </div>

        {/* Теги */}
        <div className="mb-4">
          <label className="text-xs uppercase tracking-wider font-bold text-white/60 mb-2 block">
            Теги (через запятую)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="streetwear, осень, оверсайз"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-orange-500/60 focus:outline-none text-sm text-white placeholder-white/30 transition-all"
          />
        </div>

        {/* Обложка */}
        <div className="mb-6">
          <label className="text-xs uppercase tracking-wider font-bold text-white/60 mb-2 block">
            Обложка кейса
          </label>
          <div className="flex items-center gap-4">
            {cover ? (
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                <img src={cover} alt="cover" className="w-full h-full object-cover" />
                <button
                  onClick={() => setCover('')}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-pink-500/60 transition-all"
                >
                  <X size={12} />
                </button>
              </div>
            ) : null}

            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-6 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-orange-500/60 hover:bg-orange-500/5 cursor-pointer transition-all">
              <Upload size={18} className="text-orange-400" />
              <span className="text-sm text-white/60">
                {cover ? 'Заменить' : 'Загрузить картинку'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, setCover)}
              />
            </label>
          </div>
          <div className="text-[11px] text-white/40 mt-2">
            До 500 КБ · JPG, PNG, WebP · сжать можно на squoosh.app
          </div>
        </div>

        {/* Вещи */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs uppercase tracking-wider font-bold text-white/60">
              Вещи в кейсе ({items.length})
            </label>
            <button
              onClick={addItem}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold hover:bg-orange-500/25 transition-all"
            >
              <Plus size={13} /> Добавить вещь
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white/50">
                    Вещь #{index + 1}
                  </div>
                  {items.length > 2 && (
                    <button
                      onClick={() => removeItem(index)}
                      className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-500/30 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  {/* Превью картинки */}
                  <div className="flex-shrink-0">
                    {item.imageUrl ? (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => updateItem(index, 'imageUrl', '')}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-pink-500/60 transition-all"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <label className="w-20 h-20 rounded-xl bg-white/5 border border-dashed border-white/20 hover:border-orange-500/60 cursor-pointer flex items-center justify-center transition-all">
                        <Upload size={18} className="text-white/40" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (val) =>
                              updateItem(index, 'imageUrl', val)
                            )
                          }
                        />
                      </label>
                    )}
                  </div>

                  {/* Поля */}
                  <div className="flex-1 flex flex-col gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      placeholder="Название вещи"
                      maxLength={40}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-orange-500/60 focus:outline-none text-sm text-white placeholder-white/30 transition-all"
                    />
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Короткое описание"
                      maxLength={60}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-orange-500/60 focus:outline-none text-xs text-white placeholder-white/30 transition-all"
                    />
                  </div>
                </div>

                {/* Цена + редкость */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={item.price || ''}
                    onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                    placeholder="Цена, ₽"
                    min={1}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-orange-500/60 focus:outline-none text-xs text-white placeholder-white/30 transition-all"
                  />
                  <select
                    value={item.rarity}
                    onChange={(e) => updateItem(index, 'rarity', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-orange-500/60 focus:outline-none text-xs text-white transition-all cursor-pointer"
                  >
                    {RARITY_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value} className="bg-[#101018]">
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Кнопки */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border border-white/10 bg-white/5 font-bold hover:bg-white/10 transition-all"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 font-extrabold shadow-[0_12px_32px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 transition-all"
          >
            Создать кейс
          </button>
        </div>
      </div>
    </div>
  )
}