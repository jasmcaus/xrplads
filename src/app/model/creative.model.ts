export interface CreativeUser {
    address: string
}

export interface Creative {
    id:	number,
    owner: CreativeUser,
    nft_cid: string,
    url: string,
    thumbnail?: string,
    name: string,
    description: string,
    blockchain_ref?: number,
    type?: string
}

export interface CreativeFromServer {
    data: Creative[]
}