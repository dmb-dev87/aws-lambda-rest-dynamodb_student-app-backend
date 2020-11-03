'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#student_id': 'student_id',
      '#student_name': 'student_name',
      '#subject_names': 'subject_names',
      '#total_score': 'total_score',
    },
    ExpressionAttributeValues: {
      ':student_id': data.student_id,
      ':student_name': data.student_name,
      ':subject_names': data.subject_names,
      ':total_score': data.total_score,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #student_id = :student_id, #student_name = :student_name, #subject_names = :subject_names, #total_score = :total_score, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the student item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
