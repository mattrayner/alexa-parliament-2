'use strict';

import * as AWS from 'aws-sdk';
import {Configuration} from '../../src/configuration';
import {AWSError} from 'aws-sdk';

// Configure AWS to use eu-west-1 region during testing
AWS.config.update({region: 'eu-west-1'});

class DDBController {

  private ddbService = new AWS.DynamoDB({
    endpoint: 'http://localhost:8000'
  });

  private documentClient = null;

  async getFromDDB(userId: string, localDB:boolean=true): Promise<AWS.DynamoDB.Types.DocumentClient.GetItemOutput> {
    this.setupDocumentClient(localDB);

    return new Promise<AWS.DynamoDB.Types.DocumentClient.GetItemOutput>((resolve, reject) => {
      var params: AWS.DynamoDB.Types.DocumentClient.GetItemInput = {
        TableName: new Configuration().dbTableName,
        Key: {
          id: userId
        }
      };

      this.documentClient.get(params, (err: AWSError, data: AWS.DynamoDB.Types.DocumentClient.GetItemOutput) => {
        if (err) {
          console.log("Error when calling DynamoDB");
          console.log(err, err.stack); // an error occurred
          reject(err);
        } else {
          //console.log(data); // successful response
          resolve(data);
        }
      });
    });
  }

  async initialiseDDB(userId: string, localDB:boolean=true): Promise<AWS.DynamoDB.Types.DocumentClient.UpdateItemOutput> {
    this.setupDocumentClient(localDB);

    return new Promise<AWS.DynamoDB.Types.DocumentClient.UpdateItemOutput>((resolve, reject) => {

      var params: AWS.DynamoDB.Types.DocumentClient.PutItemInput = {
        TableName: new Configuration().dbTableName,
        Item: {
          id: userId,
          attributes: {
            lastLaunched: (new Date().getTime()) - (new Configuration().longformLaunchThreshold + 100), // Initialise a user so that the 'short' launch message will be played.
            playedCount: 0
          }
        }
      };

      this.documentClient.put(params, (err: AWSError, data: AWS.DynamoDB.Types.DocumentClient.UpdateItemOutput) => {
        if (err) {
          console.log("Error when calling DynamoDB");
          console.log(err, err.stack); // an error occurred
          reject(err);
        } else {
          // console.log(data); // successful response
          resolve(data);
        }
      });
    });
  }

  /*
   * Used for unit testing only, to prepare the database before the test
   */
  async deleteFromDDB(userId: string, localDB:boolean=true): Promise<AWS.DynamoDB.Types.DocumentClient.DeleteItemOutput> {
    this.setupDocumentClient(localDB);

    return new Promise<AWS.DynamoDB.Types.DocumentClient.DeleteItemOutput>((resolve, reject) => {

      var params: AWS.DynamoDB.Types.DocumentClient.DeleteItemInput = {
        TableName: new Configuration().dbTableName,
        Key: {
          id: userId
        }
      };

      this.documentClient.delete(params, (err: AWSError, data: AWS.DynamoDB.Types.DocumentClient.DeleteItemOutput) => {
        if (err) {
          console.log("Error when deleting item from DynamoDB");
          console.log(err, err.stack); // an error occurred
          reject(err);
        } else {
          // console.log(data); // successful response
          resolve(data);
        }
      });
    });
  }

  setupDocumentClient(useLocalDb:boolean): void {
    this.documentClient = new AWS.DynamoDB.DocumentClient(useLocalDb ? {
      service: this.ddbService
    } : {});
  }
}

export const ddb = new DDBController();
