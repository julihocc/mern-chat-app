// contactService\src\graphql\resolvers\mutations\signUp.js

const { UserInputError } = require("../../utils/graphqlErrors");
const logger = require("../../utils/logger");

const signUp = async (
  _: any,
  { email, username, password, confirmPassword }: any,
  context: any
) => {
  const existingUserByEmail =
    await context.dataSources.authAPI.getUserByEmail(email);

  if (existingUserByEmail) {
    logger.error("Email already in use");
    throw new UserInputError("Email already in use");
  }

  const existingUserByUsername =
    await context.dataSources.authAPI.getUserByUsername(username);

  if (existingUserByUsername) {
    logger.error("Username already in use");
    throw new UserInputError("Username already in use");
  }

  if (password !== confirmPassword) {
    logger.error("Passwords don't match");
    throw new UserInputError("Passwords don't match");
  }

  const rollback = async (label: any, action: any) => {
    try {
      await action();
    } catch (rollbackError: any) {
      logger.error(`Signup rollback failed (${label}): ${rollbackError.message}`);
    }
  };

  let user: any;
  try {
    user = await context.dataSources.authAPI.createUser(
      email,
      username,
      password
    );
    try {
      await context.dataSources.chatAPI.createUser(
        user._id,
        user.email,
        user.username
      );
    } catch (chatError: any) {
      await rollback("auth user", () => context.dataSources.authAPI.deleteUser(user._id));
      throw chatError;
    }
    try {
      await context.dataSources.contactAPI.createUser(
        user._id,
        user.email,
        user.username
      );
    } catch (contactError: any) {
      await rollback("contact user", () => context.dataSources.contactAPI.deleteUser(user._id));
      await rollback("chat user", () => context.dataSources.chatAPI.deleteUser(user._id));
      await rollback("auth user", () => context.dataSources.authAPI.deleteUser(user._id));
      throw contactError;
    }

    logger.debug(`Created user ${user.email}`);


  const token = await context.dataSources.authAPI.getTokenByPayload(
    user._id,
    user.email
  );

  context.res.cookie("authToken", token.token, {
    httpOnly: true,
    maxAge: 3600000,
    sameSite: "lax",
    path: "/",
  });

  return { token: token.token, user };  
} catch (error: any) {
    logger.error(`Error creating user: ${error.message}`);
    throw new UserInputError(
      `Error creating user: ${error.message}`
    );
  }
};

module.exports = { signUp };
