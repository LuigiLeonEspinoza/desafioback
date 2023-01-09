import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse, formatJSONResponseError } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import tableoperation from "./model/tableOperation";
import schema from "./schema";

const client = new DynamoDB({});

const generateToken: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async ( event) => {
  const token: string = event.body.token;  
  if(!validatePK(event.headers.Authorization)){
    return formatJSONResponseError({ message: "the pk format inavalidated" });
  }
  try {
    const ddbDocClient = DynamoDBDocument.from(client);
    const data: any = await ddbDocClient.scan(tableoperation(token));
    if (data.Items.length > 0) {
      const { card, tokenbody } = data.Items[0];
      const currentDate = new Date().getTime();
      if (tokenbody.date_expires_token < currentDate) {
        return formatJSONResponseError({ message: "the token is expired" });
      }
      const { cvv, ...resto } = unmarshall(card);
      return formatJSONResponse(resto);
    } else {
      return formatJSONResponseError({ message: "token not validated" });
    }
  } catch (error) {
    return formatJSONResponseError(error);
  }
};


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

export const main = middyfy(generateToken);
