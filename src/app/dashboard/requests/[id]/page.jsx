'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { showTicket, updateTicket, getDepartments, getTicketPriorities, getTicketStatuses, replyTicket } from '../../../../../lib/app'
import StatusBadge from '../../../components/StatusBadge'
import { Calendar, User, Building, Paperclip, MessageSquare, ArrowRight, Download, Clock, Edit2, Save, X } from 'lucide-react'
import Link from 'next/link'
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import toast from 'react-hot-toast'

export default function TicketDetailPage() {
  const { id } = useParams()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Reply/Comment modal state
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [replyData, setReplyData] = useState({ message: '', file: null })
  const [commentData, setCommentData] = useState({ message: '', file: null })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Reference data for dropdowns
  const [departments, setDepartments] = useState([])
  const [priorities, setPriorities] = useState([])
  const [statuses, setStatuses] = useState([])
  
  // Form state
  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    department_id: '',
    start_at: null,
    end_at: null,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [ticketRes, deptsRes, prioritiesRes, statusesRes] = await Promise.all([
          showTicket(id),
          getDepartments(),
          getTicketPriorities(),
          getTicketStatuses()
        ])
        
        const ticketData = ticketRes.data.data
        setTicket(ticketData)
        setDepartments(deptsRes.data.data || [])
        setPriorities(prioritiesRes.data.data || [])
        setStatuses(statusesRes.data.data || [])
        
        // Initialize form data
        setFormData({
          status: ticketData.status?.id?.toString() || '',
          priority: ticketData.priority?.id?.toString() || '',
          department_id: ticketData.department?.id?.toString() || '',
          start_at: ticketData.dates?.start_at ? new Date(ticketData.dates.start_at) : null,
          end_at: ticketData.dates?.end_at ? new Date(ticketData.dates.end_at) : null,
        })
      } catch (err) {
        console.error(err)
        setError('خطا در دریافت اطلاعات تیکت')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const formatDateTime = (dateObj) => {
    if (!dateObj) return null
    const date = dateObj.toDate ? dateObj.toDate() : new Date(dateObj)
    const offset = date.getTimezoneOffset()
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000))
    return adjustedDate.toISOString().slice(0, 19).replace("T", " ")
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const dataToUpdate = {
        status: formData.status || undefined,
        priority: formData.priority || undefined,
        department_id: formData.department_id || undefined,
        start_at: formData.start_at ? formatDateTime(formData.start_at) : undefined,
        end_at: formData.end_at ? formatDateTime(formData.end_at) : undefined,
      }
      
      // Remove undefined values
      Object.keys(dataToUpdate).forEach(key => {
        if (dataToUpdate[key] === undefined) delete dataToUpdate[key]
      })
      
      const res = await updateTicket(id, dataToUpdate)
      
      if (res.data.success) {
        toast.success(res.data.message || 'تیکت با موفقیت به‌روزرسانی شد')
        // Refresh ticket data
        const updatedTicket = await showTicket(id)
        setTicket(updatedTicket.data.data)
        setIsEditing(false)
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'خطا در به‌روزرسانی تیکت')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReplySubmit = async (type) => {
    const data = type === 'reply' ? replyData : commentData
    const currentUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("user")) : null
    const userId = currentUser?.id
    
    if (!userId) {
      toast.error('شناسه کاربر یافت نشد')
      return
    }
    
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('type', type)
      formData.append('message', data.message)
      formData.append('user_id', userId)
      if (data.file) {
        formData.append('attachments[]', data.file)
      }
      
      const res = await replyTicket(id, formData)
      
      if (res.data.success) {
        toast.success(res.data.message || (type === 'reply' ? 'پاسخ ثبت شد' : 'کامنت ثبت شد'))
        setShowReplyModal(false)
        setShowCommentModal(false)
        setReplyData({ message: '', file: null })
        setCommentData({ message: '', file: null })
        const updatedTicket = await showTicket(id)
        setTicket(updatedTicket.data.data)
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || `خطا در ثبت ${type === 'reply' ? 'پاسخ' : 'کامنت'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      status: ticket.status?.id?.toString() || '',
      priority: ticket.priority?.id?.toString() || '',
      department_id: ticket.department?.id?.toString() || '',
      start_at: ticket.dates?.start_at ? new Date(ticket.dates.start_at) : null,
      end_at: ticket.dates?.end_at ? new Date(ticket.dates.end_at) : null,
    })
    setIsEditing(false)
  }

  if (loading) return <p className="text-center py-10">در حال بارگذاری...</p>
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>
  if (!ticket) return <p className="text-center py-10">تیکت یافت نشد</p>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/requests"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            <span>بازگشت</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{ticket.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReplyModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>ثبت پاسخ</span>
          </button>
          <button
            onClick={() => setShowCommentModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>ثبت کامنت</span>
          </button>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>ویرایش</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره'}</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>انصراف</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">توضیحات</h3>
            <div
              className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: ticket.description }}
            />
          </div>

          {/* Replies */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">پاسخ‌ها</h3>
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600 dark:text-gray-400">
                {ticket.reply_count}
              </span>
            </div>
            {ticket.replies && ticket.replies.length > 0 ? (
              <div className="space-y-4">
                {ticket.replies.map((reply) => (
                  <div key={reply.id} className={`border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 ${reply.type === 'کامنت' ? 'bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg -mx-4' : 'p-2'}`}>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {reply.user?.full_name || 'نامشخص'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${reply.type === 'کامنت' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                        {reply.type}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(reply.created_at).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                    <div
                      className="text-sm text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: reply.message || '' }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">هنوز پاسخی ثبت نشده است</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Editable Ticket Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">اطلاعات تیکت</h3>
            <div className="space-y-4">
              {/* Status */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">وضعیت</p>
                {isEditing ? (
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">انتخاب وضعیت</option>
                    {statuses.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge status={ticket.status?.name} />
                )}
              </div>

              {/* Priority */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">اولویت</p>
                {isEditing ? (
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">انتخاب اولویت</option>
                    {priorities.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge status={ticket.priority?.name} />
                )}
              </div>

              {/* Department */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">دپارتمان</p>
                {isEditing ? (
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">انتخاب دپارتمان</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {ticket.department?.name || 'تعیین نشده'}
                  </p>
                )}
              </div>

              {/* Requester - Read only */}
              <div className="flex items-start gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">درخواست‌دهنده</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {ticket.user?.full_name || 'نامشخص'}
                  </p>
                  {ticket.user?.email && (
                    <p className="text-xs text-gray-400">{ticket.user.email}</p>
                  )}
                </div>
              </div>

              {/* Assignee - Read only */}
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">کارشناس مسئول</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {ticket.assignee?.full_name || 'در انتظار تخصیص'}
                  </p>
                </div>
              </div>

              {/* Created At - Read only */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">تاریخ ایجاد</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {new Date(ticket.created_at).toLocaleDateString('fa-IR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">زمان‌بندی</h3>
            <div className="space-y-4">
              {/* Start Date */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">زمان شروع</p>
                </div>
                {isEditing ? (
                  <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 pr-3">
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      value={formData.start_at}
                      onChange={(date) => setFormData({ ...formData, start_at: date })}
                      inputClass="border-none outline-none py-2 w-full text-sm text-gray-900 dark:text-white bg-transparent rmdp-input"
                      format="YYYY/MM/DD HH:mm"
                    />
                    {formData.start_at && (
                      <button 
                        type="button" 
                        onClick={() => setFormData({ ...formData, start_at: null })} 
                        className="text-red-500 px-3 text-xl"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-800 dark:text-white mr-7">
                    {ticket.dates?.start_at
                      ? new Date(ticket.dates.start_at).toLocaleDateString('fa-IR')
                      : 'تعیین نشده'}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">مهلت پایان</p>
                </div>
                {isEditing ? (
                  <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 pr-3">
                    <DatePicker
                      calendar={persian}
                      locale={persian_fa}
                      value={formData.end_at}
                      onChange={(date) => setFormData({ ...formData, end_at: date })}
                      inputClass="border-none outline-none py-2 w-full text-sm text-gray-900 dark:text-white bg-transparent rmdp-input"
                      format="YYYY/MM/DD HH:mm"
                    />
                    {formData.end_at && (
                      <button 
                        type="button" 
                        onClick={() => setFormData({ ...formData, end_at: null })} 
                        className="text-red-500 px-3 text-xl"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-800 dark:text-white mr-7">
                    {ticket.dates?.end_at
                      ? new Date(ticket.dates.end_at).toLocaleDateString('fa-IR')
                      : 'تعیین نشده'}
                  </p>
                )}
              </div>

              {/* Completed At - Read only */}
              {ticket.dates?.completed_at && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">تاریخ تکمیل</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {new Date(ticket.dates.completed_at).toLocaleDateString('fa-IR')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Attachments */}
          {ticket.has_attachments && ticket.files && ticket.files.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">پیوست‌ها</h3>
              </div>
              <div className="space-y-2">
                {ticket.files.map((file) => (
                  <a
                    key={file.id}
                    href={`http://localhost:8000${file.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                  >
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">
                      {file.file_name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">ثبت پاسخ</h3>
              <button onClick={() => setShowReplyModal(false)} className="text-gray-400 hover:text-gray-600 dark:text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-white mb-1">پیام</label>
                <textarea
                  value={replyData.message}
                  onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="پاسخ خود را وارد کنید..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-white mb-1">پیوست (اختیاری)</label>
                <input
                  type="file"
                  onChange={(e) => setReplyData({ ...replyData, file: e.target.files[0] })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={() => handleReplySubmit('reply')}
                  disabled={isSubmitting || !replyData.message.trim()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'در حال ثبت...' : 'ثبت پاسخ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">ثبت کامنت</h3>
              <button onClick={() => setShowCommentModal(false)} className="text-gray-400 hover:text-gray-600 dark:text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-white mb-1">پیام</label>
                <textarea
                  value={commentData.message}
                  onChange={(e) => setCommentData({ ...commentData, message: e.target.value })}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="کامنت خود را وارد کنید..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-white mb-1">پیوست (اختیاری)</label>
                <input
                  type="file"
                  onChange={(e) => setCommentData({ ...commentData, file: e.target.files[0] })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={() => handleReplySubmit('comment')}
                  disabled={isSubmitting || !commentData.message.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'در حال ثبت...' : 'ثبت کامنت'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
