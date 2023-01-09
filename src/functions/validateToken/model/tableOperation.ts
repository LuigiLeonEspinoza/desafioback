const params = (id:string) =>{
    const tablesChema = {
        TableName: "TABLE_OPERATION",        
        FilterExpression: 'tokenbody.#loc = :idtoken',
        ExpressionAttributeValues: {         
            ":idtoken" : {"S":id}       
        },
        ExpressionAttributeNames: {"#loc": "id"},
         
    }
    
    return tablesChema;
};
export default params;