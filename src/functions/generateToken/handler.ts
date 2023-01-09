import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse ,formatJSONResponseError} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { uid } from 'rand-token';
import {validate}  from 'luhn';
import {Operation} from './model/operation';
import schema from './schema';

import tableoperation from './model/tableOperation';

const client = new DynamoDB({});


const generateToken: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event)  => {
 
  if(!validatePK(event.headers.Authorization)){    
    return formatJSONResponseError({ message: "the pk format inavalidated"});    
  }else{      
    const body:any= event.body;    
    if(!validate(body.card_number)){
      return formatJSONResponseError({mesage:"the card_number is not validated"});
    }  
    const operation:Operation = generateBodyOperation(body);
    try {
      const ddbDocClient = DynamoDBDocument.from(client);
      await ddbDocClient.put(tableoperation(operation));
      const response = {token: operation.token.id};
      return formatJSONResponse(response );
    } catch (error) {
      return formatJSONResponseError(error);
    }
  }
  
};

const generateBodyOperation = (body:any)=>{

  const current_date = new Date().getTime();
  const time_expires = 900000;
  const date_expire = current_date + time_expires;
  const id = uid(16);
  const token = uid(16);
  const operation:Operation = {
    id:id,
    card: {
      card_number: body.card_number ,
      cvv: body.cvv,
      expiration_month: body.expiration_month,
      expiration_year:body.expiration_year,
      email:body.email,
    },
    token: {
      id:token,
      date_generate_token:current_date,
      date_expires_token:date_expire,
      time_expires_token:time_expires
    }
  }
  return operation;
}

const validatePK = (Authorization: string) => {
  if (Authorization == undefined) {
    return false;
  } else {
    const arrayPk = Authorization.split(" ");
    const pk = arrayPk.length == 2 ? arrayPk[1] : null;
    if (pk == null ||pk.length != 24 ||pk.slice(0, 2) != "pk" ||pk.slice(3, 7) != "test") {
      return false;
    }
    return true;
  }
};

export const main = middyfy(generateToken)
