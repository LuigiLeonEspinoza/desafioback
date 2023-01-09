import {Operation} from '../model/operation';
const params = (operation:Operation) =>{
    const tablesChema = {
        TableName: "TABLE_OPERATION",
        Item: {
          ID: operation.id,
          card: { 
            card_number: {N:operation.card.card_number},
            cvv:{N:operation.card.cvv},
            expiration_month: {S:operation.card.expiration_month},
            expiration_year:{S:operation.card.expiration_year},
            email:{S:operation.card.email},
          },      
          tokenbody: { 
            id:{S:operation.token.id},
            date_generate_token:{N:operation.token.date_generate_token},
            date_expires_token:{N:operation.token.date_expires_token},
            time_expires_token:{N:operation.token.time_expires_token},
          }
        }
    }
    
    return tablesChema;
  };
export default params;