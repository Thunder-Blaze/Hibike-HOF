import axios from "axios";

const PINATA_JWT = process.env.PINATA_JWT;

export async function uploadJsonToIPFS(data: any) {
  const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
  });
  return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
}
