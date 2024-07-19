import { format, isToday, isYesterday, subDays } from 'date-fns'
import { fr } from 'date-fns/locale'

export const formatCreatedAt = (createdAt: Date) => {
    if (isToday(createdAt)) {
        return format(createdAt, 'HH:mm', { locale: fr })
    } else if (isYesterday(createdAt)) {
        return `hier à ${format(createdAt, 'HH:mm', { locale: fr })}`
    } else if (createdAt > subDays(new Date(), 2)) {
        return `avant-hier à ${format(createdAt, 'HH:mm', { locale: fr })}`
    } else {
        return format(createdAt, 'EEEE d MMMM yyyy à HH:mm', { locale: fr })
    }
}