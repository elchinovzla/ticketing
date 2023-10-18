import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    //we are calling from the server
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx',
      headers: req.headers,
    });
  } else {
    //we are calling from the brower/client
    return axios.create({
      baseURL: '/',
    });
  }
};
