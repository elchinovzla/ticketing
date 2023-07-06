import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return <h1>You are {currentUser ? "" : "not"} signed in</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const response = await client.get("/api/users/currentuser").catch((error) => {
    console.log(error.message);
  });

  return response?.data ?? {};
};

export default LandingPage;
