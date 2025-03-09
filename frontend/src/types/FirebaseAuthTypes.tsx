enum FirebaseErrorCodes {
  UserNotFound = 'auth/user-not-found',
  WrongPassword = 'auth/wrong-password',
  TooManyRequests = 'auth/too-many-requests',
  AlreadyInUse = 'auth/email-already-in-use',
  InvalidCredential = 'auth/invalid-credential',
}

interface FirebaseError {
  code?: string;
  message?: string;
}

interface DataType {
  email: string;
  password: string;
  confirmPassword: string;
}

export type { FirebaseError, DataType };
export { FirebaseErrorCodes };
