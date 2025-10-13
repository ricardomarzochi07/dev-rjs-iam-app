import { UserType } from '@/types/signup/user_type';
import { httpClient, safeRequest } from "buddybets-http-lib";
import { HttpResponseSchema } from "buddybets-http-lib";
import { EXTERNAL_PATHS } from '@/config/externalPaths';
import { ValidatedResponse } from "buddybets-http-lib"; 
import { AxiosResponse } from 'axios';

interface SignupInitResponse {
  jwt_nonce: string;
  captcha_token: string;
  jwt_csrf: string;
}



export class TransactionService {

  /** GET /signup/init */
  static async getSignupInit(): Promise<ValidatedResponse<SignupInitResponse>> {
    return safeRequest<SignupInitResponse>(() =>
      httpClient
        .get<HttpResponseSchema<SignupInitResponse>>(
          `${EXTERNAL_PATHS.SIGNUP_SERVICE}/init`
        )
         .then((res: AxiosResponse<HttpResponseSchema<SignupInitResponse>>) => res.data)
    );
  }

  /** POST /signup/submit */
  static async postRegisterSignupSubmit(
    data: UserType
  ): Promise<ValidatedResponse<UserType>> {
    return safeRequest<UserType>(() =>
      httpClient
        .post<HttpResponseSchema<UserType>>(
          `${EXTERNAL_PATHS.SIGNUP_SERVICE}/submit`,
          data
        )
        .then((res: AxiosResponse<HttpResponseSchema<UserType>>) => res.data)
    );
  }
}


