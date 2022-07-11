import { DateTime } from 'luxon';

export interface Timeslot {
    id: number,
    from_time: DateTime,
    to_time: DateTime,
    is_booked: boolean,
    price: number
}


export interface TimeslotFromServer {
    id: number,
    from_time: string,
    to_time: string,
    is_booked: boolean,
    price: number
}

export interface TimeslotList {
    data: TimeslotFromServer[]
}
