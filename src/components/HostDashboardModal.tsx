import React, { useState, useEffect } from 'react';
import { RSVPRecord, Wish } from '../types';
import { X, Download, ShieldCheck, Users, CheckCircle2, XCircle, Trash2, Heart } from 'lucide-react';

interface HostDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteWish?: (id: string) => void;
}

const RSVP_STORAGE_KEY = 'meher_kabir_rsvps_v2';
const WISH_STORAGE_KEY = 'meher_kabir_wishes_v2';

export const HostDashboardModal: React.FC<HostDashboardModalProps> = ({
  isOpen,
  onClose,
  onDeleteWish,
}) => {
  const [rsvps, setRsvps] = useState<RSVPRecord[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [activeTab, setActiveTab] = useState<'rsvps' | 'wishes'>('rsvps');

  useEffect(() => {
    if (isOpen) {
      try {
        const savedRsvps = localStorage.getItem(RSVP_STORAGE_KEY);
        if (savedRsvps) setRsvps(JSON.parse(savedRsvps));

        const savedWishes = localStorage.getItem(WISH_STORAGE_KEY);
        if (savedWishes) setWishes(JSON.parse(savedWishes));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Computed metrics
  const totalResponses = rsvps.length;
  const attendingCount = rsvps.filter((r) => r.attendance === 'accept').length;
  const decliningCount = rsvps.filter((r) => r.attendance === 'decline').length;
  const totalHeadcount = rsvps
    .filter((r) => r.attendance === 'accept')
    .reduce((acc, curr) => acc + (curr.guestCount || 1), 0);

  const handleExportCSV = () => {
    if (rsvps.length === 0) {
      alert('No RSVP records yet to export.');
      return;
    }

    const headers = [
      'ID',
      'Attendance',
      'Full Name',
      'Email',
      'Phone',
      'Guest Count',
      'Events Attending',
      'Dietary Requirements',
      'Note to Couple',
      'Submitted At',
    ];

    const rows = rsvps.map((r) => [
      r.id,
      r.attendance === 'accept' ? 'Attending' : 'Declined',
      `"${(r.fullName || '').replace(/"/g, '""')}"`,
      `"${r.email || ''}"`,
      `"${r.phone || ''}"`,
      r.guestCount,
      `"${(r.events || []).join(', ')}"`,
      `"${(r.dietary || '').replace(/"/g, '""')}"`,
      `"${(r.note || '').replace(/"/g, '""')}"`,
      `"${r.submittedAt || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Meher_Kabir_Wedding_RSVPs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteWishLocal = (id: string) => {
    const updated = wishes.filter((w) => w.id !== id);
    setWishes(updated);
    try {
      localStorage.setItem(WISH_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    if (onDeleteWish) onDeleteWish(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#4A4038]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF6F0] w-full max-w-4xl max-h-[90vh] rounded-3xl border border-[#DFC48F] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DFC48F]/40 bg-[#F3EDE3] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="text-[#C6A15B]" size={22} />
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#4A4038] font-normal">
                Host Administration & Guestbook
              </h3>
              <p className="text-[10px] tracking-wider uppercase text-[#8A7F72]">
                Meher & Kabir Wedding · Rishikesh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FAF6F0] text-[#8A7F72] hover:text-[#4A4038] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Top Metrics Cards */}
        <div className="p-6 border-b border-[#DFC48F]/30 bg-[#FAF6F0] grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#F3EDE3] p-4 rounded-2xl border border-[#DFC48F]/40 text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#8A7F72] block">
              Total Responses
            </span>
            <span className="font-serif text-3xl text-[#4A4038] font-medium">
              {totalResponses}
            </span>
          </div>

          <div className="bg-[#F3EDE3] p-4 rounded-2xl border border-[#DFC48F]/40 text-center">
            <div className="flex items-center justify-center space-x-1 text-emerald-700 mb-0.5">
              <CheckCircle2 size={12} />
              <span className="text-[10px] uppercase tracking-wider text-[#8A7F72]">Attending</span>
            </div>
            <span className="font-serif text-3xl text-emerald-800 font-medium">
              {attendingCount}
            </span>
          </div>

          <div className="bg-[#F3EDE3] p-4 rounded-2xl border border-[#DFC48F]/40 text-center">
            <div className="flex items-center justify-center space-x-1 text-rose-700 mb-0.5">
              <XCircle size={12} />
              <span className="text-[10px] uppercase tracking-wider text-[#8A7F72]">Declined</span>
            </div>
            <span className="font-serif text-3xl text-[#8A7F72] font-medium">
              {decliningCount}
            </span>
          </div>

          <div className="bg-[#F1D9D6]/50 p-4 rounded-2xl border border-[#E3B9B4] text-center">
            <div className="flex items-center justify-center space-x-1 text-[#4A4038] mb-0.5">
              <Users size={12} className="text-[#C6A15B]" />
              <span className="text-[10px] uppercase tracking-wider text-[#8A7F72]">Headcount</span>
            </div>
            <span className="font-serif text-3xl text-[#C6A15B] font-semibold">
              {totalHeadcount}
            </span>
          </div>
        </div>

        {/* Tab switcher & export */}
        <div className="px-6 py-3 border-b border-[#DFC48F]/30 bg-[#F3EDE3]/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('rsvps')}
              className={`px-4 py-1.5 rounded-full text-xs font-sans tracking-wider uppercase transition-colors ${
                activeTab === 'rsvps'
                  ? 'bg-[#4A4038] text-white font-medium'
                  : 'text-[#8A7F72] hover:text-[#4A4038]'
              }`}
            >
              RSVP Records ({rsvps.length})
            </button>
            <button
              onClick={() => setActiveTab('wishes')}
              className={`px-4 py-1.5 rounded-full text-xs font-sans tracking-wider uppercase transition-colors ${
                activeTab === 'wishes'
                  ? 'bg-[#4A4038] text-white font-medium'
                  : 'text-[#8A7F72] hover:text-[#4A4038]'
              }`}
            >
              Wishing Wall Moderation ({wishes.length})
            </button>
          </div>

          {activeTab === 'rsvps' && (
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] hover:bg-[#F1D9D6] border border-[#DFC48F] text-xs font-sans font-medium text-[#4A4038] shadow-2xs transition-colors"
            >
              <Download size={13} className="text-[#C6A15B]" />
              <span>Export RSVPs to CSV</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'rsvps' ? (
            rsvps.length === 0 ? (
              <div className="text-center py-12 text-[#8A7F72] font-serif italic text-lg">
                No RSVP responses recorded yet. As guests submit responses, they will appear here live.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-[#DFC48F]/50 text-[#8A7F72] uppercase tracking-wider text-[10px]">
                      <th className="pb-3 font-semibold">Guest</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Party</th>
                      <th className="pb-3 font-semibold">Events</th>
                      <th className="pb-3 font-semibold">Dietary</th>
                      <th className="pb-3 font-semibold">Note</th>
                      <th className="pb-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DFC48F]/20">
                    {rsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="hover:bg-[#F3EDE3]/40 transition-colors">
                        <td className="py-3 pr-2">
                          <p className="font-serif text-sm text-[#4A4038] font-medium">{rsvp.fullName}</p>
                          <p className="text-[10px] text-[#8A7F72]">{rsvp.email}</p>
                          {rsvp.phone && <p className="text-[10px] text-[#8A7F72]">{rsvp.phone}</p>}
                        </td>
                        <td className="py-3 pr-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                              rsvp.attendance === 'accept'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {rsvp.attendance === 'accept' ? 'Attending' : 'Declined'}
                          </span>
                        </td>
                        <td className="py-3 pr-2 text-center font-serif text-sm">
                          {rsvp.attendance === 'accept' ? rsvp.guestCount : 0}
                        </td>
                        <td className="py-3 pr-2">
                          {rsvp.attendance === 'accept' && rsvp.events ? (
                            <span className="text-[10px] text-[#C6A15B] font-medium uppercase">
                              {rsvp.events.join(', ')}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-3 pr-2 text-[11px] text-[#4A4038]/80 max-w-[140px] truncate">
                          {rsvp.dietary || 'None'}
                        </td>
                        <td className="py-3 pr-2 text-[11px] text-[#8A7F72] italic max-w-[150px] truncate">
                          {rsvp.note ? `"${rsvp.note}"` : '—'}
                        </td>
                        <td className="py-3 text-[10px] text-[#8A7F72] whitespace-nowrap">
                          {rsvp.submittedAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            /* Wishes Moderation */
            <div className="space-y-3">
              {wishes.map((wish) => (
                <div
                  key={wish.id}
                  className="bg-[#F3EDE3]/70 p-4 rounded-xl border border-[#DFC48F]/40 flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-serif font-medium text-[#4A4038] text-sm">
                        {wish.author}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF6F0] border border-[#DFC48F]/40 text-[#8A7F72]">
                        {wish.tag}
                      </span>
                      <span className="text-[10px] text-[#8A7F72]">{wish.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#4A4038] font-light">“{wish.message}”</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-[#8A7F72] flex items-center space-x-1">
                      <Heart size={12} className="text-[#C6A15B]" />
                      <span>{wish.likes}</span>
                    </span>
                    <button
                      onClick={() => handleDeleteWishLocal(wish.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete inappropriate wish"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
