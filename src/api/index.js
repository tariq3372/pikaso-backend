const axios = require("axios");

const BASE_URL = "https://v1.test.socket.araby.ai/";

module.exports.generateImageApi = async (
  prompt,
  ratio,
  numberOfImages,
  style
) => {
  const data = JSON.stringify({
    prompt: prompt,
    image_size: ratio,
    num_images: numberOfImages,
    style: "",
  });
  const config = {
    method: "get",
    url: "http://pikaso-ai.me-south-1.elasticbeanstalk.com/image-gen",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  return axios(config);
};
