import { DateTime } from "luxon"

export interface PresentationBody {
    owner_address: string,
    listing_id: number,
    creative_id: number,
    contract_address: string,
    from_time: string,
    to_time: string,    
    play_price: number,
    transaction_hash?: string
}

export interface Presentation {
    id: number,
    example: number,
    listing_name: string,
    from_time: DateTime,
    to_time: DateTime,
    advert_id: number,
    creative_name: string,
    creative_description: string,
    creative_url: string,
    creative_path: string,
    status: string,
    smart_contract: string,
    spot_price: number,
    is_booked: boolean,
    adlocation_name: string,
    publish_url: string,
    processed_at: string,
    thumb_url: string,
    listing_likes?: number,
    jump_url?: string,
    listing_id: number
}

export interface PresentationBE {
    id: number,
    owner_address: string,
    example: number,
    listing_name: string,
    from_time: string,
    to_time: string,
    advert_id: number,
    creative_name: string,
    creative_description: string,
    creative_url: string,
    creative_path: string,
    status: string,
    smart_contract: string,
    spot_price: number,
    is_booked: boolean,
    adlocation_name: string,
    publish_url: string,
    processed_at: string,
    thumb_url: string,
    listing_likes: number,
    listing_weekly_users: number,
    jump_url?: string,
    listing_id: number
}

export interface PresentationList {
    data: PresentationBE[]
}

export interface NftPresentationList {
    [id: number]: NftPresentation
}

export interface NftPresentation {
    presentation_id: number,
    adspace_id: number,
    creative_id: number,
    advertiser_cost: number,
    start_time: number,
    end_time: number,
    transfered: boolean,
    advertiser_account_id: string,
    publisher_account_id: string,
    ad_space_name: string,
    publisher_earn: any,
    creative_ref: number,
    show_kind: any,
    entertainment: string,
    entertainment_fee: number,
    status: string
}
