import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'

export default function EventModal({ open, onClose, defaultDate, onSave }){
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(defaultDate || dayjs().format('YYYY-MM-DD'))
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [color, setColor] = useState('#6366f1')

  useEffect(()=>{ if(defaultDate) setDate(defaultDate) }, [defaultDate])

  if(!open) return null

  function save(){
    if(!title) return alert('Add a title')
    onSave({ title, date, startTime, endTime, color })
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded p-4 w-96" onClick={(e)=> e.stopPropagation()}>
        <h3 className="font-semibold mb-2">Add Event</h3>
        <div className="flex flex-col gap-2">
          <input className="border px-2 py-1 rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input type="date" className="border px-2 py-1 rounded" value={date} onChange={e=>setDate(e.target.value)} />
          <div className="flex gap-2">
            <input type="time" className="border px-2 py-1 rounded" value={startTime} onChange={e=>setStartTime(e.target.value)} />
            <input type="time" className="border px-2 py-1 rounded" value={endTime} onChange={e=>setEndTime(e.target.value)} />
          </div>
          <input type="color" className="w-full h-8 p-0 border rounded" value={color} onChange={e=>setColor(e.target.value)} />
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button className="px-3 py-1 bg-gray-100 rounded" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  )
}
