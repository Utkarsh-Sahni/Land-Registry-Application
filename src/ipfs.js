const IPFS = require('ipfs-api')

const ipfsClient = require('ipfs-http-client');
const projectId = '2On1vW5pO07LFC0S239nTTN346z';
const projectSecret = '863c63f46d46eb748e7bdf4434971785';
const auth =
'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
console.log(auth)

const ipfs = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    }
});




// const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'})




export default ipfs