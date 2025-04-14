
// استبدال كامل المحتوى لتجنب تداخل الأنواع
import * as TicketQueries from './tickets/ticketQueries';
import * as TicketMutations from './tickets/ticketMutations';
import { fetchClients } from './tickets/clientService';
import { fetchStaff } from './tickets/staffService';

// تصدير الوظائف بشكل صريح لتجنب التداخل العميق للأنواع
export const fetchTickets = TicketQueries.fetchTickets;

export { fetchClients, fetchStaff };

export const createTicket = TicketMutations.createTicket;
export const updateTicket = TicketMutations.updateTicket;
export const deleteTicket = TicketMutations.deleteTicket;

// تصدير الأنواع
export type { Ticket } from './tickets/types';
