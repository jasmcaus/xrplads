// export interface Listing {
//     id: number,
//     name: string,
//     location: string,
//     description: string,
//     price: number,
//     likes?: number,
//     publisher_name?: string, // owner
//     // preview_url: string,
//     thumb_url: string,
//     spot_metadata?: string // unknown destination
//     views_amount?: number,
//     average_time?: number,
//     max_traffic?: number,
//     active: boolean,
//     jump_url?: string
// }

export interface Owner {
    address: string
}

export interface Listing {
    id: number,
    owner: Owner,
    name: string,
    description: string,
    location: string,
    price: number,
    thumb_url: string,
    likes: number,
    weekly_users: number,
    is_active: boolean
}

export interface ListingList {
    data: Listing[]
}
