const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

module.exports = async function (context, req) {
    const data = JSON.stringify(req.body);
    const date = new Date();

    // Connect to Azure Blob Storage
    //const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const connectionString = "DefaultEndpointsProtocol=https;AccountName=shoprunstorage;AccountKey=VgC5zWSVqcp+/UTuSh0GTwjalXox0I7zCaLZxTN17ZaNv+FbLXm+mDxWLKhLpKg2Ew5sOf8J0HvR+AStTb/lbg==;EndpointSuffix=core.windows.net";

    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

    // Connect to Blob Storage Container
    //const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    const containerName = 'datastore';
    context.log(containerName);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobName = 'data-' + date.toISOString() + '.json';
    //for await (const blob of containerClient.listBlobsFlat()) {
    //    context.log(`ListBlob: ${blob.name}`);
    //}

    context.log(`Uploading ${blobName} ...`);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    context.log(`requestId: ${uploadBlobResponse.requestId}`);

    const responseMessage = `{ "uri": "https://shoprunstorage.blob.core.windows.net/datastore/${blobName}" }`

    context.res = {
        body: responseMessage
    }
}
