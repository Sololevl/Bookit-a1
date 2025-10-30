import { Slot } from '../types';

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit' }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  }).format(date).toLowerCase();
};

export interface GroupedSlot {
  dateLabel: string;
  dateKey: string;
  times: {
    id: number;
    timeLabel: string;
    left: number;
    soldOut: boolean;
  }[];
}

export const groupSlotsByDate = (slots: Slot[]): GroupedSlot[] => {
  const groups = new Map<string, GroupedSlot>();
  
  slots.forEach(slot => {
    const date = new Date(slot.startTime);
    const dateKey = date.toISOString().split('T')[0];
    const dateLabel = formatDate(date);
    
    if (!groups.has(dateKey)) {
      groups.set(dateKey, { dateKey, dateLabel, times: [] });
    }
    
    const available = slot.totalCapacity - slot.bookedCount;
    groups.get(dateKey)!.times.push({
      id: slot.id,
      timeLabel: formatTime(date),
      left: available,
      soldOut: available <= 0,
    });
  });
  
  return Array.from(groups.values());
};