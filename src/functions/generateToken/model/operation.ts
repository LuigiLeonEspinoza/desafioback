interface Operation{
    id: string
    card: Card,
    token: token
}
interface token{
    id:string,
    date_generate_token:number,
    date_expires_token:number,
    time_expires_token:number

}

interface Card {
    card_number: number,
    cvv?: number,
    expiration_month: string,
    expiration_year:string,
    email:string,
}
 export {Operation,Card}



