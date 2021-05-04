interface IAuth {
  auth: string[];
}

export default function Access(initialState: IAuth) {
  const { auth } = initialState;
  console.log('auth', auth);
  return auth;
}
