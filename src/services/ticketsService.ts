
// استبدال كامل المحتوى لتجنب تداخل الأنواع
import * as TicketQueries from './tickets/ticketQueries';
import * as TicketMutations from './tickets/ticketMutations';

// تصدير الوظائف بشكل صريح لتجنب التداخل العميق للأنواع
export const fetchTickets = TicketQueries.fetchTickets;
export const fetchTicketById = TicketQueries.fetchTicketById;
export const fetchClients = TicketQueries.fetchClients;
export const fetchStaff = TicketQueries.fetchStaff;

export const createTicket = TicketMutations.createTicket;
export const updateTicket = TicketMutations.updateTicket;
export const deleteTicket = TicketMutations.deleteTicket;

// تصدير الأنواع
export type { Ticket, TicketStatus } from './tickets/types';
