import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { BehaviorSubject, Observable } from "rxjs"
import { finalize, map } from "rxjs/operators"
import {
    Listing,
    ListingList,
    Timeslot,
    TimeslotList,
    Creative,
    CreativeFromServer,
    PresentationBody,
    Presentation, 
    PresentationList, 
    PresentationBE
} from "../model"
import { environment } from "../../environments/environment"
import { DateTime } from "luxon"

import Web3 from "web3"
import detectEthereumProvider from "@metamask/detect-provider"

const xrpl = require("xrpl")

const local_storage_metamask_address = "xrplads_metamask_address"
const local_storage_xrp_address = "xrplads_xrp_address"
const local_storage_xrp_secret = "xrplads_xrp_secret"


@Injectable({providedIn: "root"})
export class AppService {
    private signed = new BehaviorSubject<boolean>(false)
    signed$ = this.signed.asObservable()

    private metamask_address = new BehaviorSubject<string>("")
    metamask_address$ = this.metamask_address.asObservable()

    private xrp_address = new BehaviorSubject<string>("")
    xrp_address$ = this.xrp_address.asObservable()

    private xrp_secret = new BehaviorSubject<string>("")
    xrp_secret$ = this.xrp_secret.asObservable()

    private client: any
    private wallet: any

    private CASCADE_XRP_ADDRESS: string = process.env.CASCADE_XRP_ADDRESS
    private CASCADE_XRP_SECRET: string = process.env.CASCADE_XRP_SECRET

    private ethereum: any
    private web3: Web3

    api = environment.api_url

    private months: string[] = [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    constructor(
        private httpClient: HttpClient,
    ) { 
        const _ = this.get_metamask_address()
    }

    set_xrp_account(
        address: string,
        secret: string
    ) {
        localStorage.setItem(local_storage_xrp_address, address)
        localStorage.setItem(local_storage_xrp_secret, secret)
        this.xrp_address.next(address)
        this.xrp_secret.next(address)

        console.debug("Set details:", {
            address,
            secret
        })

        console.debug("XRPL:", xrpl)
        this.wallet = xrpl.Wallet.fromSeed(secret)
    }

    get_xrp_wallet() {
        const secret = this.get_xrp_account().secret
        if(!!secret) {
            const wallet = xrpl.Wallet.fromSeed(secret)
            this.wallet = wallet
            return wallet
        }
        return undefined
    }

    get_xrp_account() {
        let address = this.xrp_address.value 
        let secret = this.xrp_secret.value
        if(!address) {
            address = localStorage.getItem(local_storage_xrp_address) || "";
            this.xrp_address.next(address)
        }
        if(!secret) {
            secret = localStorage.getItem(local_storage_xrp_secret) || "";
            this.xrp_secret.next(secret)
        }

        return {
            address: address,
            secret: secret
        }
    }

    set_metamask_address(address: string) {
        localStorage.setItem(local_storage_metamask_address, address);
        this.metamask_address.next(address);

        console.log("Adding metamask address")
        this.add_user(address)
    }

    get_metamask_address(): string {
        return this.get_xrp_account().address
    }

    log_out_metamask() {
        localStorage.removeItem(local_storage_metamask_address)
        localStorage.removeItem(local_storage_xrp_address)
        localStorage.removeItem(local_storage_xrp_secret)
    }

    async detect_metamask() {
        this.ethereum = await detectEthereumProvider();
    }

    is_metamask_available(): boolean {
        return !!this.ethereum;
    }

    connect_client(is_nft: boolean = false): any {
        let client = new xrpl.Client("wss://s.altnet.rippletest.net:51233", { connectionTimeout: 50000 })
        if(is_nft) {
            client = new xrpl.Client("wss://xls20-sandbox.rippletest.net:51233", { connectionTimeout: 50000 })
        }

        return client
    }

    log_out() {
        this.log_out_metamask();
        location.reload();
    }

    add_user(address: string): void {
        console.log("Adding user: ", address)
        const data = this.httpClient.get<string>(`${this.api}/add_user/${address}/`)
    }

    /*
        Listings
    */
    get_listings(): Observable<Listing[]> {
        return this.httpClient.get<ListingList>(`${this.api}/listings/`)
            .pipe(map(l => { return l?.data }))
    }

    get_listings_by_id(id: number): Observable<Listing> {
        return this.httpClient.get<Listing>(`${this.api}/listings/id/${id}/`)
    }

    async book_listing(presentation: PresentationBody): Observable<Presentation> {
        const client = this.connect_client(true)
        await client.connect()

        const wallet = (await client.fundWallet()).wallet

        const tx_blob = client.autofill({
            "TransactionType": "Payment",
            "Account": wallet.address,
            "Amount": xrpl.convertStringToHex(presentation.play_price),
            "Destination": this.CASCADE_XRP_ADDRESS
        })
        
        // Sign transaction
        const signed = wallet.sign(tx_blob)

        const tx = await client.submitAndWait(signed.tx_blob)

        await client.disconnect()
    
        alert("Payment confirmed!")

        return this.httpClient.post<Presentation>(`${this.api}/save_presentation`, presentation);
    }

    
    /*
        Timeslots
    */
    parseTimeObj(time: DateTime) {
        const t = time.toObject()
        // {"year":2022,"month":5,"day":6,"hour":4,"minute":50,"second":0,"millisecond":0}
        return `2022-05-${t.day} 0${t.hour}:${t.minute}:00`
    }

    parse_string_date_to_datetime(date: string): DateTime {
        const split = date.split("/")
        
        if(split.length !== 3)
            alert(`Invalid format. Expected format: mm/dd/yyyy. Got ${date}`)

        const month = split[0]
        const day = split[1]
        const year = split[2]

        const datetime = DateTime.fromObject({ year: +year, month: +month, day: +day })

        return datetime
    }

    get_timeslots(
        date: string
    ): Observable<Timeslot[]> {
        let corrected_from_time: string = ""
        let corrected_to_time: string = ""

        return this.httpClient.get<TimeslotList>(
            `${this.api}/timeslots/${date}/`,
        )
        .pipe(
            map(value => {
                if(value) {
                    return value.data.map(a => {
                        corrected_from_time = a.from_time.replace(" ", "T")
                        corrected_to_time = a.to_time.replace(" ", "T")
                    
                        return {
                            ...a,
                            from_time: DateTime.fromISO(corrected_from_time), 
                            to_time: DateTime.fromISO(corrected_to_time)
                        }
                    });
                } else {
                    return []
                }
            })
        )
    }


    /* 
        Creatives
    */
    get_creatives(): Observable<Creative[]> {
        const data = {
            owner_address: this.get_xrp_account().address
        }
        return this.httpClient.post<CreativeFromServer>(`${this.api}/creatives/`, data)
            .pipe(
                map(c => { return c.data })
            );
    }

    get_creative_by_id(id: number): Observable<Creative> {
        const data = {
            creative_id: id,
            owner_address: this.get_xrp_account().address
        }

        return this.httpClient.post<Creative>(`${this.api}/creatives/id/`, data)
    }


    async save_creative(
        address: string, 
        name: string, 
        description: string, 
        filename: string, 
        file: File
    ): Promise<Observable<any>> {
        try {
            const client = this.connect_client(true)
            await client.connect()

            const wallet = (await client.fundWallet()).wallet

            const tx_blob = {
                TransactionType: "NFTokenMint",
                Account: wallet.classicAddress,
                URI: xrpl.convertStringToHex(name),
                Flags: 8,
                TokenTaxon: 0
            }

            const tx = await client.submitAndWait(tx_blob, { wallet })

            await client.disconnect()
        
            alert(`Token Issued! Uri: ${tx.result.meta.TransactionResult}`)
        } catch(err) {
            console.error("Error:", err)
            alert("Error with XRP Ledger. Check the console for more details.")
        }

        const data = { 
            address: address,
            name: name,
            description: description,
            filename: filename,
            file: file
        };

        return this.httpClient.post<any>(`${this.api}/save_creative`, data);
    }


    _gen_random_number(
        min: number,
        max: number
    ): number {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }


    async create_listing(
        name: string,
        description: string,
        location: string,
        price_in_xrp: string,
        filename: string,
        file: string
    ) {
        const address = this.get_xrp_account().address
        if(!!address) {
            const data = {
                sender: address,
                name: name,
                description: description,
                location: location,
                price_in_xrp: price_in_xrp,
                filename: filename,
                file: file
            }
            const val = await this.httpClient.post<any>(`${this.api}/create_listing/`, data)
                                     .pipe(finalize(() => {}))
                                     .toPromise()
            console.debug("Returned value:", val)


            // Mint NFT
            try {
                const client = this.connect_client(true)
                await client.connect()

                const wallet = (await client.fundWallet()).wallet

                const tx_blob = {
                    TransactionType: "NFTokenMint",
                    Account: wallet.classicAddress,
                    URI: xrpl.convertStringToHex(val.data),
                    Flags: 8,
                    TokenTaxon: 0
                }

                const tx = await client.submitAndWait(tx_blob, { wallet })

                await client.disconnect()
            
                alert(`NFT Issued! Uri: ${tx.result.meta.TransactionResult}`)
            } catch(err) {
                console.error("Error:", err)
                alert("Error with XRP Ledger. Check the console for more details.")
            }
        } else {
            alert("Connect your wallet first.")
        }
    }
}
